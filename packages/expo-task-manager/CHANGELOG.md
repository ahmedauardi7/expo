# Changelog

## Unpublished

### 🛠 Breaking changes

### 🎉 New features

### 🐛 Bug fixes

- [android] add missing proguard-rules for `expo-task-manager` ([#37833](https://github.com/expo/expo/pull/37833) by [@chrfalch](https://github.com/chrfalch))

### 💡 Others

## 13.1.6 - 2025-07-01

### 💡 Others

- Remove "Please" from warnings and errors ([#36862](https://github.com/expo/expo/pull/36862) by [@brentvatne](https://github.com/brentvatne))

## 13.1.5 — 2025-04-30

_This version does not introduce any user-facing changes._

## 13.1.4 — 2025-04-25

_This version does not introduce any user-facing changes._

## 13.1.3 — 2025-04-14

_This version does not introduce any user-facing changes._

## 13.1.2 — 2025-04-11

### 💡 Others

- Removed warning about running on Expo Go. This is handled in packages using the Task Manager. ([#36038](https://github.com/expo/expo/pull/36038) by [@chrfalch](https://github.com/chrfalch))

## 13.1.1 — 2025-04-09

_This version does not introduce any user-facing changes._

## 13.1.0 — 2025-04-04

### 🐛 Bug fixes

- [iOS] Added guards to avoid crashing the app if we try to write task results that contains NSNull values ([#35477](https://github.com/expo/expo/pull/35477) by [@chrfalch](https://github.com/chrfalch))

### 💡 Others

- [Android] Started using expo modules gradle plugin. ([#34176](https://github.com/expo/expo/pull/34176) by [@lukmccall](https://github.com/lukmccall))
- [apple] Migrate remaining `expo-module.config.json` to unified platform syntax. ([#34445](https://github.com/expo/expo/pull/34445) by [@reichhartd](https://github.com/reichhartd))

## 13.0.0 — 2025-01-21

### 💡 Others

- [android][background-task] Added callback parameter to new executeTask method after adding package expo-background-task ([#33438](https://github.com/expo/expo/pull/33438) by [@chrfalch](https://github.com/chrfalch))

## 12.0.3 — 2024-11-13

### 💡 Others

- [Android] Added implementation of `executeTask` method in `TaskManagerUtils` ([#32849](https://github.com/expo/expo/pull/32849) by [@chrfalch](https://github.com/chrfalch))

## 12.0.2 — 2024-11-05

### 💡 Others

- Correct the return type of `TaskManagerTaskExecutor`. ([#32557](https://github.com/expo/expo/pull/32557) by [@Simek](https://github.com/Simek))

## 12.0.1 — 2024-10-31

### 💡 Others

- [android] Added implementation in package to look up TaskService instance from expo-modules-core ([#32300](https://github.com/expo/expo/pull/32300) by [@chrfalch](https://github.com/chrfalch))

## 12.0.0 — 2024-10-22

### 🛠 Breaking changes

- Bumped iOS deployment target to 15.1. ([#30840](https://github.com/expo/expo/pull/30840) by [@tsapeta](https://github.com/tsapeta))

### 🐛 Bug fixes

- `isAvailableAsync()` now returns `false` in Expo Go for Android. ([#29823](https://github.com/expo/expo/pull/29823)) by [@vonovak](https://github.com/vonovak)
- Add missing `react-native` peer dependencies for isolated modules. ([#30486](https://github.com/expo/expo/pull/30486) by [@byCedric](https://github.com/byCedric))

### 💡 Others

- Keep using the legacy event emitter as the module is not fully migrated to Expo Modules API. ([#28946](https://github.com/expo/expo/pull/28946) by [@tsapeta](https://github.com/tsapeta))

## 11.8.2 - 2024-05-29

### 🐛 Bug fixes

- [Android] Fix the task manager events not being sent to the JS side. ([#29024](https://github.com/expo/expo/pull/29024) by [@behenate](https://github.com/behenate))

## 11.8.1 — 2024-04-23

_This version does not introduce any user-facing changes._

## 11.8.0 — 2024-04-18

### 💡 Others

- [iOS] Add privacy manifest describing required reason API usage. ([#27770](https://github.com/expo/expo/pull/27770) by [@aleqsio](https://github.com/aleqsio))
- drop unused web `name` property. ([#27437](https://github.com/expo/expo/pull/27437) by [@EvanBacon](https://github.com/EvanBacon))
- Removed deprecated backward compatible Gradle settings. ([#28083](https://github.com/expo/expo/pull/28083) by [@kudo](https://github.com/kudo))

## 11.7.1 - 2024-01-25

### 🐛 Bug fixes

- On `Android`, added events to module definition to clear warnings. ([#26654](https://github.com/expo/expo/pull/26654) by [@alanjhughes](https://github.com/alanjhughes))

## 11.7.0 — 2023-11-14

### 🛠 Breaking changes

- Bumped iOS deployment target to 13.4. ([#25063](https://github.com/expo/expo/pull/25063) by [@gabrieldonadel](https://github.com/gabrieldonadel))
- On `Android` bump `compileSdkVersion` and `targetSdkVersion` to `34`. ([#24708](https://github.com/expo/expo/pull/24708) by [@alanjhughes](https://github.com/alanjhughes))

## 11.6.0 — 2023-10-17

### 🛠 Breaking changes

- Dropped support for Android SDK 21 and 22. ([#24201](https://github.com/expo/expo/pull/24201) by [@behenate](https://github.com/behenate))

### 💡 Others

- Transpile for Node 18 (LTS). ([#24471](https://github.com/expo/expo/pull/24471) by [@EvanBacon](https://github.com/EvanBacon))
- Migrated codebase to use Expo Modules API. ([#24157](https://github.com/expo/expo/pull/24157) by [@lukmccall](https://github.com/lukmccall))

## 11.5.0 — 2023-09-04

### 🎉 New features

- Added support for React Native 0.73. ([#24018](https://github.com/expo/expo/pull/24018) by [@kudo](https://github.com/kudo))

## 11.4.0 — 2023-08-02

_This version does not introduce any user-facing changes._

## 11.3.0 — 2023-06-21

### 🐛 Bug fixes

- Fixed Android build warnings for Gradle version 8. ([#22537](https://github.com/expo/expo/pull/22537), [#22609](https://github.com/expo/expo/pull/22609) by [@kudo](https://github.com/kudo))

### 💡 Others

- Update `defineTask` to accept type arguments. ([#21958](https://github.com/expo/expo/pull/21958) by [@kazuma0129](https://github.com/kazuma0129))

## 11.2.0 — 2023-05-08

_This version does not introduce any user-facing changes._

## 11.1.1 — 2023-02-09

_This version does not introduce any user-facing changes._

## 11.1.0 — 2023-02-03

### 💡 Others

- On Android bump `compileSdkVersion` and `targetSdkVersion` to `33`. ([#20721](https://github.com/expo/expo/pull/20721) by [@lukmccall](https://github.com/lukmccall))

## 11.0.1 — 2022-10-28

_This version does not introduce any user-facing changes._

## 11.0.0 — 2022-10-25

### 🛠 Breaking changes

- Bumped iOS deployment target to 13.0 and deprecated support for iOS 12. ([#18873](https://github.com/expo/expo/pull/18873) by [@tsapeta](https://github.com/tsapeta))

### 💡 Others

- [plugin] Migrate import from @expo/config-plugins to expo/config-plugins and @expo/config-types to expo/config. ([#18855](https://github.com/expo/expo/pull/18855) by [@brentvatne](https://github.com/brentvatne))
- Drop `@expo/config-plugins` dependency in favor of peer dependency on `expo`. ([#18595](https://github.com/expo/expo/pull/18595) by [@EvanBacon](https://github.com/EvanBacon))

## 10.3.0 — 2022-07-07

_This version does not introduce any user-facing changes._

## 10.2.1 — 2022-04-25

### 🐛 Bug fixes

- Fixed another Android 12+ runtime crash caused by `PendingIntent` misconfiguration. ([#17164](https://github.com/expo/expo/pull/17164) by [@kudo](https://github.com/kudo))

## 10.2.0 — 2022-04-18

### 🐛 Bug fixes

- Fixed Android 12+ runtime crash caused by `PendingIntent` misconfiguration. ([#17052](https://github.com/expo/expo/pull/17052) by [@bbarthec](https://github.com/bbarthec))

### 💡 Others

- Updated `@expo/config-plugins` from `4.0.2` to `4.0.14` ([#15621](https://github.com/expo/expo/pull/15621) by [@EvanBacon](https://github.com/EvanBacon))

### ⚠️ Notices

- On Android bump `compileSdkVersion` to `31`, `targetSdkVersion` to `31` and `Java` version to `11`. ([#16941](https://github.com/expo/expo/pull/16941) by [@bbarthec](https://github.com/bbarthec))

## 10.1.1 - 2022-02-01

### 🐛 Bug fixes

- Fix `Plugin with id 'maven' not found` build error from Android Gradle 7. ([#16080](https://github.com/expo/expo/pull/16080) by [@kudo](https://github.com/kudo))

## 10.1.0 — 2021-12-03

_This version does not introduce any user-facing changes._

## 10.0.1 — 2021-10-01

_This version does not introduce any user-facing changes._

## 10.0.0 — 2021-09-28

### 🛠 Breaking changes

- [plugin] Moved `UIBackgroundModes` `location` to the `expo-location` plugin ([#14142](https://github.com/expo/expo/pull/14142) by [@EvanBacon](https://github.com/EvanBacon))
- Dropped support for iOS 11.0 ([#14383](https://github.com/expo/expo/pull/14383) by [@cruzach](https://github.com/cruzach))

### 🎉 New features

- Use stable manifest ID where applicable. ([#12964](https://github.com/expo/expo/pull/12964) by [@wschurman](https://github.com/wschurman))

### 🐛 Bug fixes

- Fix building errors from use_frameworks! in Podfile. ([#14523](https://github.com/expo/expo/pull/14523) by [@kudo](https://github.com/kudo))

### 💡 Others

- Updated `@expo/config-plugins` ([#14443](https://github.com/expo/expo/pull/14443) by [@EvanBacon](https://github.com/EvanBacon))

## 9.2.0 — 2021-06-16

### 🐛 Bug fixes

- Enable kotlin in all modules. ([#12716](https://github.com/expo/expo/pull/12716) by [@wschurman](https://github.com/wschurman))

### 💡 Others

- Migrated constants interface from `unimodules-constants-interface` to `expo-modules-core`. ([#12876](https://github.com/expo/expo/pull/12876) by [@tsapeta](https://github.com/tsapeta))

## 9.1.0 — 2021-03-10

### 🎉 New features

- Converted plugin to TypeScript. ([#11715](https://github.com/expo/expo/pull/11715) by [@EvanBacon](https://github.com/EvanBacon))
- Updated Android build configuration to target Android 11 (added support for Android SDK 30). ([#11647](https://github.com/expo/expo/pull/11647) by [@bbarthec](https://github.com/bbarthec))

### 🐛 Bug fixes

- Add TypeScript definition of `executionInfo.appState`. ([#11670](https://github.com/expo/expo/pull/11670) by [@Noitidart](https://github.com/Noitidart))
- Accept generic data type of task body objects. ([#11669](https://github.com/expo/expo/pull/11669) by [@Noitidart](https://github.com/Noitidart))

## 9.0.0 — 2021-01-15

### 🛠 Breaking changes

- Dropped support for iOS 10.0 ([#11344](https://github.com/expo/expo/pull/11344) by [@tsapeta](https://github.com/tsapeta))

### 🎉 New features

- Created config plugins ([#11538](https://github.com/expo/expo/pull/11538) by [@EvanBacon](https://github.com/EvanBacon))

## 8.6.0 — 2020-11-17

### 🎉 New features

- Added `isAvailableAsync` method. ([#10657](https://github.com/expo/expo/pull/10657) by [@PranshuChittora](https://github.com/pranshuchittora))

## 8.5.0 — 2020-08-18

_This version does not introduce any user-facing changes._

## 8.4.0 — 2020-07-16

### 🐛 Bug fixes

- Added some safety checks to prevent `NullPointerExceptions` on Android. ([#8864](https://github.com/expo/expo/pull/8864) by [@mczernek](https://github.com/mczernek))
- Fix tasks not being removed from memory when unregistering them. ([#8612](https://github.com/expo/expo/pull/8612) by [@mczernek](https://github.com/mczernek))

## 8.3.0 — 2020-05-29

### 🐛 Bug fixes

- Upgrading an application does not cause `BackgroundFetch` tasks to unregister. ([#8348](https://github.com/expo/expo/pull/8438) by [@mczernek](https://github.com/mczernek))
