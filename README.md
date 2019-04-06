<img src="https://user-images.githubusercontent.com/1689183/55673023-25239a00-5857-11e9-9699-5f2d0ab365cf.png" width="100">

# Stanford Daily mobile app
This is the Stanford Daily mobile app. Download the app at https://app.stanforddaily.com/. Contributions welcome!

# Setup
```
npm i
npm i -g expo-cli

npm run ios

# or
npm run android
```

# Release
```
expo build:ios --release-channel production
expo build:android --release-channel production

expo publish --release-channel production
```

Or,

```
expo build:ios --release-channel development
expo build:android --release-channel development

expo publish --release-channel development
```
