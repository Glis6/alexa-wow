import * as Alexa from "alexa-sdk";

class MockHandler implements Alexa.Handler {
    on: any;
    emit(event: string, ...args: any[]): boolean {
        return true;
    }
    emitWithState: any = {};
    state: any = {};
    handler: any = {};
    event: any = {};
    attributes: any = {};
    context: any = {};
    name: any = {};
    isOverriden: any = {};
}

export default MockHandler;