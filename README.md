# Dialogflow: Webhook Template using Node.js and Cloud Functions for Firebase

## Setup Instructions

### Steps

1.  Deploy the fulfillment webhook provided in the functions folder using [Google Cloud Functions for Firebase](https://firebase.google.com/docs/functions/):
    1.  Follow the instructions to [set up and initialize Firebase SDK for Cloud Functions](https://firebase.google.com/docs/functions/get-started#set_up_and_initialize_functions_sdk). Make sure to select the project that you have previously generated in the Actions on Google Console and to reply `N` when asked to overwrite existing files by the Firebase CLI.
    2.  Navigate to the <code>firebase/functions</code> directory and run <code>npm install</code>.
    3.  Run `firebase deploy --only functions` and take note of the endpoint where the fulfillment webhook has been published. It should look like `Function URL (yourAction): https://${REGION}-${PROJECT}.cloudfunctions.net/yourAction`
2.  Go to the Dialogflow console and select _Fulfillment_ from the left navigation menu.
3.  Enable _Webhook_, set the value of _URL_ to the `Function URL` from the previous step, then click _Save_.
4.  Select _Intents_ from the left navigation menu. Select the `Default Welcome Intent` intent, scroll down to the end of the page and click _Fulfillment_, check _Use webhook_ and then click _Save_. This will allow you to have the welcome intent be a basic webhook intent to test.
5.  Build out your agent and business logic by adding function handlers for Dialogflow actions.

firebase deploy --only functions:dialogflowFirebaseFulfillment
