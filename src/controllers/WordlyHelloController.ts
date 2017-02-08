import * as Alexa from "alexa-sdk";

import WordlyHello from "../services/WorldlyHello";
import IntentController from "./IntentController";

class WordlyHelloController extends IntentController {

    constructor(handler: Alexa.Handler) {
        super(handler);
    }

    sayHello(): void {
        // NOTE: The types are not recognizing intent as a property of request
        // need to caste it as any for now to get the slot value.
        let request: any = this.handler.event.request;
        console.log(request.intent.slots);
        let language = request.intent.slots.Language.value;
        WordlyHello.getHello({ language }).then((response) => {

            let ssml = response.ssml;
            // We need to clean the <speak> tags because
            // alexa-sdk adds them
            ssml = ssml.replace("<speak>", "");
            ssml = ssml.replace("</speak>", "");

            this.handler.emit(":tell", ssml);
        }).catch((error) => {
            console.log(error);
            this.handler.emit(":tell", "I could not find hello in that language");
        });
    }
}

export default WordlyHelloController;