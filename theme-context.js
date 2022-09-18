import React from "react";
import { DeviceType } from "expo-device"

export const ThemeContext = React.createContext({
  theme: "light",
  toggleTheme: () => {},
  deviceType: DeviceType.PHONE
})