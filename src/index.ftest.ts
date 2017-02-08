import * as bst from "bespoken-tools";
import { expect } from "chai";

describe("HelloWorld", function () {
    let server: bst.LambdaServer;
    let alexa: bst.BSTAlexa;

    beforeEach(function (done) {
        server = new bst.LambdaServer("./index.js", 10000, true);
        alexa = new bst.BSTAlexa("http://localhost:10000?disableSignatureCheck=true",
            "./speechAssets/IntentSchema.json",
            "./speechAssets/SampleUtterances.txt",
            "HelloWorld");
        server.start(function () {
            alexa.start(function (error) {
                if (error !== undefined) {
                    console.error("Error: " + error);
                } else {
                    done();
                }
            });
        });
    });

    afterEach(function (done) {
        alexa.stop(function () {
            server.stop(function () {
                done();
            });
        });
    });
    describe("LaunchIntent", function () {
        it("launches", function () {
            alexa.launched(function (error, payload) {
                expect(payload.response.outputSpeech.ssml).to.exist;
                expect(payload.response.outputSpeech.ssml).to.contain("Hello World");
            });
        });
    });
    describe("WorldlyHelloIntent", function () {
        describe("when requested a known language", function () {
            it("returns a response", function () {
                alexa.spoken("say hello in {welsh}", function(error, payload) {
                    expect(payload.response.outputSpeech.ssml).to.exist;
                    expect(payload.response.outputSpeech.ssml).to.contain("Helo");
                });
            });
        });
    });
});