import * as Alexa from "alexa-sdk";

import HelloWorldController from "./controllers/HelloWorldController";
import WorldlyHelloController from "./controllers/WorldlyHelloController";

interface AlexaHandlerCallbackFunction extends Function {
    (err: any, response: any): void;
}

let handler = function(event: Alexa.RequestBody<Alexa.Request>, context: Alexa.Context, callback: AlexaHandlerCallbackFunction): void {
    let alexa = Alexa.handler(event, context, callback);
    alexa.registerHandlers({
        "LaunchRequest": function() { new HelloWorldController(this).sayHello(); },
        "HelloWorldIntent": function() { new HelloWorldController(this).sayHello(); },
        "WorldlyHelloIntent": function() { new WorldlyHelloController(this).sayHello(); }
    });
    alexa.execute();
};

export default handler;