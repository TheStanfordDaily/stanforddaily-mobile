# The Stanford Daily

<p>
  <!-- iOS -->
  <a href="https://apps.apple.com/us/app/stanford-daily/id1341270063">
    <img alt="Supports Expo iOS" longdesc="Supports Expo iOS" src="https://img.shields.io/badge/iOS-4630EB.svg?style=flat&logo=APPLE&labelColor=999999&logoColor=fff" />
  </a>
  <!-- Android -->
  <a href="https://play.google.com/store/apps/details?id=com.Stanford.Daily.App&hl=en_US&gl=US">
    <img alt="Supports Expo Android" longdesc="Supports Expo Android" src="https://img.shields.io/badge/Android-4630EB.svg?style=flat&logo=ANDROID&labelColor=A4C639&logoColor=fff" />
  </a>
  <!-- Runs with Expo -->
  <a href="https://github.com/expo/expo">
    <img alt="Runs with Expo" longdesc="Runs with Expo" src="https://img.shields.io/badge/Runs%20with%20Expo-000.svg?style=flat&logo=EXPO&labelColor=ffffff&logoColor=000)">
  </a>
</p>

Official mobile app of the independent, student-run newspaper of Stanford University. Contributions are welcome!

## Getting Started

Clone the Stanford Daily mobile app repository from GitHub:
```bash
git clone https://github.com/TheStanfordDaily/stanforddaily-mobile.git
```
Navigate to the project directory:
```bash
cd stanforddaily-mobile
```

Install packages by running the `yarn` terminal command from the project directory, and then start the bundler:
```bash
yarn
npx expo start
```

- When prompted by the command line interface, type `i` or `a` to try it on a [valid simulator](https://reactnative.dev/docs/environment-setup).
- Alternatively, scan the QR code and open the project in a React runtime on a physical device:
  - iOS: [Client iOS](https://itunes.apple.com/app/apple-store/id982107779)
  - Android: [Client Android](https://play.google.com/store/apps/details?id=host.exp.exponent&referrer=blankexample)
- If you have native iOS code run `npx pod-install` and restart the bundler.

## Installation Details

If you encounter any errors, it is possible that your system does not meet the prerequisites for running this project, in which case some additional setup may be required as described in the [internal Notion page](https://www.notion.so/stanforddaily/Installations-6e21a44be24749d09532e2e4467d4a80?pvs=4). Alternatively, consult the [Expo installation guide](https://docs.expo.dev/get-started/installation/).

## Troubleshooting

If you encounter any issues during the installation process or elsewhere, please reach out to the Chief Technology Officer at [tech@stanforddaily.com](mailto:tech@stanforddaily.com) or [open an issue](https://github.com/TheStanfordDaily/stanforddaily-mobile/issues) on GitHub.

## Adding Native Code

This project can be run from a web browser or the Expo client app. You may find that you want to add more native code later on. You can do this by ejecting the project and rebuilding it yourself.

- Run `yarn eject` to create the native projects.
- You can still run your project in the web browser or Expo client after this step. You will not, however, be able to access any new Node modules.
- For future reference, consider reading the latest [Expo Modules](https://docs.expo.dev/modules/module-api/) API documentation to learn more about how to use native modules in your project without going to such lengths.

## Release

- Deploy the native app to the App Store and the Play Store with this guide: [Deployment](https://docs.expo.io/distribution/app-stores/).

## Notes

- Learn more about the React Native development process with [Expo](https://expo.dev/).
- See what API and components are available in the [React runtimes](https://docs.expo.io/versions/latest/).
- Find out more about developing apps and websites: [Guides](https://docs.expo.io/guides/).
