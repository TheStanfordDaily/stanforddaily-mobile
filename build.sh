echo "Log in start"
expo login --non-interactive -u ${EXPO_USERNAME} -p ${EXPO_PASSWORD}
echo "log in end"
echo "log out start"
expo logout
echo "log out end"
# expo eject --non-interactive --eject-method expoKit
# git add -A
# git commit -m "Eject to ExpoKit"
# git remote add release git@ssh.dev.azure.com:v3/stanforddaily/StanfordDaily_Mobile/StanfordDaily_Mobile
# git push -f release master
