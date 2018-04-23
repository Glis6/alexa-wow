import "isomorphic-fetch";
import {
    WorldlyHelloResponse,
    WorldlyHelloRequest
} from "../models";

const data: any = require("./WorldlyHelloData.json");

namespace WorldlyHello {
    export function getHello(request: WorldlyHelloRequest): Promise<WorldlyHelloResponse> {
        return new Promise((resolve, reject) => {
            const language = request.language.toLowerCase();
            const response = data[language];

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