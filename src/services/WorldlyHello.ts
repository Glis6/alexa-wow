import "isomorphic-fetch";

let data: any = require("./WorldlyHelloData.json");

namespace WorldlyHello {

    export interface WorldlyHelloRequest {
        language: string;
    }

    export interface WorldlyHelloResponse {
        text: string;
        ssml: string;
    }

    export function getHello(request: WorldlyHelloRequest): Promise<WorldlyHelloResponse> {
        return new Promise((resolve, reject) => {

            let language = request.language.toLowerCase();

            let response = data[language];

            if (response) {
                resolve({
                    text: response.text,
                    ssml: response.ssml
                });
            } else {
                reject(new Error(`Unknown language, request=${JSON.stringify(request)}`));
            }
        });
    }
}

export default WorldlyHello;