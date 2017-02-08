import { expect } from "chai";

import WorldlyHello from "./WorldlyHello";

describe("WorldlyHello", function() {
    describe("getHello", function() {
        it("returns the correct response for a known language", function() {
            return WorldlyHello.getHello({language: "english"}).then((response) => {
                expect(response.text).to.equal("Hello");
                expect(response.ssml).to.equal("<speak>Hello</speak>");
            });
        });
        it("rejects for an unknown language", function() {
            return WorldlyHello.getHello({language: "german"}).catch((error) => {
                expect(error).to.exist;
            });
        });
    });
});