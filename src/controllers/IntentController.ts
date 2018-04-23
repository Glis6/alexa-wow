import * as Alexa from "alexa-sdk";

class IntentController {
    protected handler: Alexa.Handler<any>;

    constructor(handler: Alexa.Handler<any>) {
        this.handler = handler;
    }
}

export default IntentController;