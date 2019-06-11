[![The Stanford Daily logo](https://github.com/TheStanfordDaily/stanforddaily-graphic-assets/raw/master/DailyLogo/DailyLogo.png)](https://www.stanforddaily.com/)

# The Stanford Daily mobile app
[![Build Status](https://travis-ci.com/TheStanfordDaily/stanforddaily-mobile.svg?branch=master)](https://travis-ci.com/TheStanfordDaily/stanforddaily-mobile)

This is the Stanford Daily mobile app. Download the app at https://app.stanforddaily.com/. Contributions welcome!

## Setup
```
npm i
npm i -g expo-cli

npm start
# Open the app by getting the Expo app on your phone and scanning the QR code.

# or

npm run ios

# or
npm run android
```

## Release
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
