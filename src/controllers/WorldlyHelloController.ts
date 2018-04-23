import * as Alexa from "alexa-sdk";

import WorldlyHello from "../services/WorldlyHello";
import { IntentController } from "../models";

class WorldlyHelloController extends IntentController {

    constructor(handler: Alexa.Handler<Alexa.Request>) {
        super(handler);
    }

    sayHello(): void {
        const request: Alexa.IntentRequest = this.handler.event.request;
        // Pull the Language value form the slots
        const language = request.intent.slots.Language.value;
        WorldlyHello.getHello({ language }).then((response) => {

            let ssml = response.ssml;
            // We need to clean the <speak> tags because
            // alexa-sdk adds them
            ssml = ssml.replace("<speak>", "");
            ssml = ssml.replace("</speak>", "");

            this.handler.emit(":tell", ssml);
        }).catch((error) => {
            console.error(error);
            this.handler.emit(":tell", "I could not find hello in that language");
        });
    }
}

export default WorldlyHelloController;