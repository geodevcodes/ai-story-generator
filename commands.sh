# One time setup
npm install --global eas-cli
eas login

# Build and deploy
npx expo export --platform web
eas deploy


# Build and deploy for testing (preview)
npm install -g eas-cli
eas login
eas whoami
eas build:configure
# paste this to your eas.json
#  "preview": {
#       "ios": {
#         "simulator": true
#       },
#        "android": {
#         "buildType": "apk"
#       }
#     },
eas build -p android --profile preview