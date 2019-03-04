# StanfordDaily mobile app

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

Or

```
expo build:ios --release-channel development
expo build:android --release-channel development

expo publish --release-channel development
```
