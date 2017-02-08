import * as Alexa from "alexa-sdk";

class IntentController {
    protected handler: Alexa.Handler;

    constructor(handler: Alexa.Handler) {
        this.handler = handler;
    }
}

export default IntentController;