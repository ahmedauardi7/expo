'use client';

import {
  NavigationContainerRefWithCurrent,
  useNavigationContainerRef,
} from '@react-navigation/native';
import Constants from 'expo-constants';
import * as Linking from 'expo-linking';
import equal from 'fast-deep-equal';
import { useSyncExternalStore, useMemo, ComponentType, Fragment } from 'react';
import { Platform } from 'react-native';

import {
  canGoBack,
  canDismiss,
  goBack,
  linkTo,
  navigate,
  dismiss,
  dismissAll,
  push,
  reload,
  replace,
  setParams,
  dismissTo,
  LinkToOptions,
  prefetch,
} from './routing';
import { getSortedRoutes } from './sort-routes';
import { UrlObject, getRouteInfoFromState } from '../LocationProvider';
import { RouteNode } from '../Route';
import { getPathDataFromState, getPathFromState } from '../fork/getPathFromState';
import { cleanPath, routePatternToRegex } from '../fork/getStateFromPath-forks';
import { ExpoLinkingOptions, LinkingConfigOptions, getLinkingConfig } from '../getLinkingConfig';
import { parseRouteSegments } from '../getReactNavigationConfig';
import { getRoutes } from '../getRoutes';
import { RedirectConfig } from '../getRoutesCore';
import { convertRedirect } from '../getRoutesRedirects';
import { resolveHref, resolveHrefStringWithSegments } from '../link/href';
import { Href, RequireContext } from '../types';
import { getQualifiedRouteComponent } from '../useScreens';
import { shouldLinkExternally } from '../utils/url';
import * as SplashScreen from '../views/Splash';

type ResultState = any;

/**
 * This is the global state for the router. It is used to keep track of the current route, and to provide a way to navigate to other routes.
 *
 * There should only be one instance of this class and be initialized via `useInitializeExpoRouter`
 */
export class RouterStore {
  routeNode!: RouteNode | null;
  rootComponent!: ComponentType;
  linking?: ExpoLinkingOptions;
  private hasAttemptedToHideSplash: boolean = false;

  initialState?: ResultState;
  rootState?: ResultState;
  nextState?: ResultState;
  routeInfo?: UrlObject;
  splashScreenAnimationFrame?: number;

  // The expo-router config plugin
  config: any;
  redirects?: (readonly [RegExp, RedirectConfig, boolean])[];

  navigationRef!: NavigationContainerRefWithCurrent<ReactNavigation.RootParamList>;
  navigationRefSubscription!: () => void;

  rootStateSubscribers = new Set<() => void>();
  storeSubscribers = new Set<() => void>();

  linkTo = linkTo.bind(this);
  getSortedRoutes = getSortedRoutes.bind(this);
  goBack = goBack.bind(this);
  canGoBack = canGoBack.bind(this);
  push = push.bind(this);
  dismiss = dismiss.bind(this);
  dismissTo = dismissTo.bind(this);
  replace = replace.bind(this);
  dismissAll = dismissAll.bind(this);
  canDismiss = canDismiss.bind(this);
  setParams = setParams.bind(this);
  navigate = navigate.bind(this);
  reload = reload.bind(this);
  prefetch = prefetch.bind(this);

  initialize(
    context: RequireContext,
    navigationRef: NavigationContainerRefWithCurrent<ReactNavigation.RootParamList>,
    linkingConfigOptions: LinkingConfigOptions = {}
  ) {
    // Clean up any previous state
    this.initialState = undefined;
    this.rootState = undefined;
    this.nextState = undefined;
    this.linking = undefined;
    this.navigationRefSubscription?.();
    this.rootStateSubscribers.clear();
    this.storeSubscribers.clear();

    this.config = Constants.expoConfig?.extra?.router;
    // On the client, there is no difference between redirects and rewrites
    this.redirects = [this.config?.redirects, this.config?.rewrites]
      .filter(Boolean)
      .flat()
      .map((route) => {
        return [
          routePatternToRegex(parseRouteSegments(route.source)),
          route,
          shouldLinkExternally(route.destination),
        ] as const;
      });

    this.routeNode = getRoutes(context, {
      ...Constants.expoConfig?.extra?.router,
      ignoreEntryPoints: true,
      platform: Platform.OS,
    });

    // We always needs routeInfo, even if there are no routes. This can happen if:
    //  - there are no routes (we are showing the onboarding screen)
    //  - getInitialURL() is async
    this.routeInfo = {
      unstable_globalHref: '',
      pathname: '',
      isIndex: false,
      params: {},
      segments: [],
    };

    if (this.routeNode) {
      // We have routes, so get the linking config and the root component
      this.linking = getLinkingConfig(this, this.routeNode, context, {
        ...Constants.expoConfig?.extra?.router,
        ...linkingConfigOptions,
      });
      this.rootComponent = getQualifiedRouteComponent(this.routeNode);

      // By default React Navigation is async and does not render anything in the first pass as it waits for `getInitialURL`
      // This will cause static rendering to fail, which once performs a single pass.
      // If the initialURL is a string, we can prefetch the state and routeInfo, skipping React Navigation's async behavior.
      const initialURL = this.linking?.getInitialURL?.();
      if (typeof initialURL === 'string') {
        this.rootState = this.linking.getStateFromPath?.(initialURL, this.linking.config);
        this.initialState = this.rootState;
        if (this.rootState) {
          this.routeInfo = this.getRouteInfo(this.rootState);
        }
      }
    } else {
      // Only error in production, in development we will show the onboarding screen
      if (process.env.NODE_ENV === 'production') {
        throw new Error('No routes found');
      }

      // In development, we will show the onboarding screen
      this.rootComponent = Fragment;
    }

    /**
     * Counter intuitively - this fires AFTER both React Navigation's state changes and the subsequent paint.
     * This poses a couple of issues for Expo Router,
     *   - Ensuring hooks (e.g. useSearchParams()) have data in the initial render
     *   - Reacting to state changes after a navigation event
     *
     * This is why the initial render renders a Fragment and we wait until `onReady()` is called
     * Additionally, some hooks compare the state from both the store and the navigationRef. If the store it stale,
     * that hooks will manually update the store.
     *
     */
    this.navigationRef = navigationRef;
    this.navigationRefSubscription = navigationRef.addListener('state', (data) => {
      const state = data.data.state as ResultState;

      if (!this.hasAttemptedToHideSplash) {
        this.hasAttemptedToHideSplash = true;
        // NOTE(EvanBacon): `navigationRef.isReady` is sometimes not true when state is called initially.
        this.splashScreenAnimationFrame = requestAnimationFrame(() => {
          SplashScreen._internal_maybeHideAsync?.();
        });
      }

      let shouldUpdateSubscribers = this.nextState === state;
      this.nextState = undefined;

      // This can sometimes be undefined when an error is thrown in the Root Layout Route.
      // Additionally that state may already equal the rootState if it was updated within a hook
      if (state && state !== this.rootState) {
        store.updateState(state, undefined);
        shouldUpdateSubscribers = true;
      }

      // If the state has changed, or was changed inside a hook we need to update the subscribers
      if (shouldUpdateSubscribers) {
        for (const subscriber of this.rootStateSubscribers) {
          subscriber();
        }
      }
    });

    for (const subscriber of this.storeSubscribers) {
      subscriber();
    }
  }

  updateState(state: ResultState, nextState = state) {
    store.rootState = state;
    store.nextState = nextState;

    const nextRouteInfo = store.getRouteInfo(state);

    if (!equal(this.routeInfo, nextRouteInfo)) {
      store.routeInfo = nextRouteInfo;
    }
  }

  getRouteInfo(state: ResultState) {
    return getRouteInfoFromState(
      (state: Parameters<typeof getPathFromState>[0], asPath: boolean) => {
        return getPathDataFromState(state, {
          screens: {},
          ...this.linking?.config,
          preserveDynamicRoutes: asPath,
          preserveGroups: asPath,
          shouldEncodeURISegment: false,
        });
      },
      state
    );
  }

  // This is only used in development, to show the onboarding screen
  // In production we should have errored during the initialization
  shouldShowTutorial() {
    return !this.routeNode && process.env.NODE_ENV === 'development';
  }

  /** Make sure these are arrow functions so `this` is correctly bound */
  subscribeToRootState = (subscriber: () => void) => {
    this.rootStateSubscribers.add(subscriber);
    return () => this.rootStateSubscribers.delete(subscriber);
  };
  subscribeToStore = (subscriber: () => void) => {
    this.storeSubscribers.add(subscriber);
    return () => this.storeSubscribers.delete(subscriber);
  };
  snapshot = () => {
    return this;
  };
  rootStateSnapshot = () => {
    return this.rootState!;
  };
  routeInfoSnapshot = () => {
    return this.routeInfo!;
  };

  cleanup() {
    if (this.splashScreenAnimationFrame) {
      cancelAnimationFrame(this.splashScreenAnimationFrame);
    }
  }

  getStateFromPath(href: Href, options: LinkToOptions = {}) {
    href = resolveHref(href);
    href = resolveHrefStringWithSegments(href, this.routeInfo, options);
    return this.linking?.getStateFromPath?.(href, this.linking.config);
  }

  applyRedirects<T extends string | null | undefined>(url: T): T | undefined {
    if (typeof url !== 'string') {
      return url;
    }

    const nextUrl = cleanPath(url);
    const redirect = this.redirects?.find(([regex]) => regex.test(nextUrl));

    if (!redirect) {
      return url;
    }

    // If the redirect is external, open the URL
    if (redirect[2]) {
      let href = redirect[1].destination as T & string;
      if (href.startsWith('//') && Platform.OS !== 'web') {
        href = `https:${href}` as T & string;
      }

      Linking.openURL(href);
      return;
    }

    return this.applyRedirects<T>(convertRedirect(url, redirect[1]) as T);
  }
}

export const store = new RouterStore();

export function useExpoRouter() {
  return useSyncExternalStore(store.subscribeToStore, store.snapshot, store.snapshot);
}

function syncStoreRootState() {
  if (store.navigationRef.isReady()) {
    const currentState = store.navigationRef.getRootState() as unknown as ResultState;

    if (store.rootState !== currentState) {
      store.updateState(currentState);
    }
  }
}

export function useStoreRootState() {
  syncStoreRootState();
  return useSyncExternalStore(
    store.subscribeToRootState,
    store.rootStateSnapshot,
    store.rootStateSnapshot
  );
}

export function useStoreRouteInfo() {
  syncStoreRootState();
  return useSyncExternalStore(
    store.subscribeToRootState,
    store.routeInfoSnapshot,
    store.routeInfoSnapshot
  );
}

export function useInitializeExpoRouter(context: RequireContext, options: LinkingConfigOptions) {
  const navigationRef = useNavigationContainerRef();
  useMemo(() => store.initialize(context, navigationRef, options), [context]);
  useExpoRouter();
  return store;
}
