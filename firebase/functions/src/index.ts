// See https://github.com/dialogflow/dialogflow-fulfillment-nodejs
"use strict";

const functions = require("firebase-functions");
const { WebhookClient } = require("dialogflow-fulfillment");
// const { Card, Suggestion } = require("dialogflow-fulfillment");
const moment = require("moment-timezone");

import { getGreeting, checkGetUpTime } from "./timeFuncs";

process.env.DEBUG = "dialogflow:debug"; // enables lib debugging statements

exports.dialogflowFirebaseFulfillment = functions.https.onRequest(
  (request, response) => {
    const agent = new WebhookClient({ request, response });
    console.log(
      "Dialogflow Request headers: " + JSON.stringify(request.headers)
    );
    console.log("Dialogflow Request body: " + JSON.stringify(request.body));

    function welcomeHandler(_agent) {
      const conv = _agent.conv();
      conv.ask(
        `Welcome to Sleep Calc. Before we begin, I need to know your timezone. What city are you currently in ?`
      );
      _agent.add(conv);
    }

    function wakeHandler(_agent) {
      const cityContext = _agent.getContext("city");
      const parsedCity = cityContext.parameters.city.split(" ").join("_");
      console.log("city context is", cityContext);
      const rawToday = moment();
      const today = rawToday.tz(`America/${parsedCity}`); //TODO: make this modular, not just restricted to Americas
      console.log("today ", today);
      const greet = getGreeting(today);

      const conv = _agent.conv();
      conv.ask(
        greet +
          `If you go to sleep right now, you should try to wake up at one of the following times: ${checkGetUpTime(
            today
          )
            .splice(1)
            .map((times, index, orig) => " " + times)}`
      );
      _agent.add(conv);
    }

    function fallback(_agent) {
      _agent.add(`I didn't understand`);
      _agent.add(`I'm sorry, can you try again?`);
    }
    // Run the proper function handler based on the matched Dialogflow intent name
    const intentMap = new Map();
    intentMap.set("Default Welcome Intent", welcomeHandler);
    intentMap.set("get_city", wakeHandler);
    intentMap.set("Default Fallback Intent", fallback);
    agent.handleRequest(intentMap);
  }
);
