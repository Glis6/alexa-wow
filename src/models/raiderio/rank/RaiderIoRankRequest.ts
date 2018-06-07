import {BasicRaiderIoRequest} from "../BasicRaiderIoRequest";

export interface RaiderIoRankRequest extends BasicRaiderIoRequest {
    rankType: {
        value: string,
        custom: boolean
    };
    rankRegion: {
        value: string,
        custom: boolean
    }
}