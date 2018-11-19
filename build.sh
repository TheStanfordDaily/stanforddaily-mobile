npm i -g expo
expo login --non-interactive -u ${EXPO_USERNAME} -p ${EXPO_PASSWORD}
expo eject --non-interactive --eject-method expoKit
git add -A
git commit -m "Eject to ExpoKit"
git remote add release git@ssh.dev.azure.com:v3/stanforddaily/StanfordDaily_Mobile/StanfordDaily_Mobile
git push -f release master
