git checkout master
expo login --non-interactive -u ${EXPO_USERNAME} -p ${EXPO_PASSWORD}
expo eject --non-interactive --eject-method expoKit
git config --global user.name "Azure DevOps CI Server"
git config --global user.email "ashwin@stanforddaily.com"
git add -A
git commit -m "Eject to ExpoKit"
git remote add release git@ssh.dev.azure.com:v3/stanforddaily/StanfordDaily_Mobile/StanfordDaily_Mobile
git push -f release HEAD:master
