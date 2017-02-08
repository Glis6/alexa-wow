import * as Alexa from "alexa-sdk";

import HelloWorldController from "./controllers/HelloWorldController";
import WordlyHelloController from "./controllers/WordlyHelloController";

let handler = function(event: Alexa.RequestBody, context: Alexa.Context, callback: Function): void {
    let alexa = Alexa.handler(event, context, callback);
    alexa.registerHandlers({
        "LaunchRequest": function() { new HelloWorldController(this).sayHello(); },
        "HelloWorldIntent": function() { new HelloWorldController(this).sayHello(); },
        "WorldlyHelloIntent": function() { new WordlyHelloController(this).sayHello(); }
    });
    alexa.execute();
};

export default handler;