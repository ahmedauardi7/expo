// Copyright 2015-present 650 Industries. All rights reserved.

import SwiftUI
import ExpoModulesCore

final class SwiftUIPickerProps: ExpoSwiftUI.ViewProps {
  @Field var label: String = ""
  @Field var variant: String = "automatic"
  @Field var options: [String] = []
  @Field var selectedIndex: Int?
  var onOptionSelected = EventDispatcher()
}

struct SwiftUIPicker: ExpoSwiftUI.View {
  @ObservedObject var props: SwiftUIPickerProps
  @State var selection: Int?
  @State var prevSelectedIndex: Int?

  init(props: SwiftUIPickerProps) {
    self.props = props
  }

  var body: some View {
    if #available(iOS 17.0, tvOS 17.0, *) {
      Picker(props.label, selection: $selection) {
        ForEach(Array(props.options.enumerated()), id: \.0) { index, option in
          Text(option).tag(index)
        }
      }
      #if !os(tvOS)
      .if(props.variant == "wheel", { $0.pickerStyle(.wheel) })
      #endif
      .if(props.variant == "segmented", { $0.pickerStyle(.segmented) })
      .if(props.variant == "menu", { $0.pickerStyle(.menu) })
      .onChange(of: selection, perform: { newValue in
        if props.selectedIndex == newValue {
          return
        }
        let payload = [
          "index": newValue ?? 0,
          "label": props.options[newValue ?? 0]
        ]
        props.onOptionSelected(payload)
      })
      .onReceive(props.selectedIndex.publisher, perform: { newValue in
        if prevSelectedIndex == newValue {
          return
        }
        selection = newValue
        prevSelectedIndex = newValue
      })
    }
  }
}
