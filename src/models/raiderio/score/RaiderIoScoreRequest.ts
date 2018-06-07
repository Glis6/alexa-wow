import {BasicRaiderIoRequest} from "../BasicRaiderIoRequest";

export interface RaiderIoScoreRequest extends BasicRaiderIoRequest {
    scoreType: {
        value: string,
        custom: boolean
    };
}