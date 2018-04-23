import * as Alexa from "alexa-sdk";

class IntentController {
    protected handler: Alexa.Handler<Alexa.Request>;

    constructor(handler: Alexa.Handler<Alexa.Request>) {
        this.handler = handler;
    }
}

export default IntentController;