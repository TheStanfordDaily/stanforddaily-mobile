import React from "react";
import * as Device from "expo-device"

export const ThemeContext = React.createContext({
  theme: "light",
  toggleTheme: () => {},
  deviceType: Device.DeviceType.PHONE
})