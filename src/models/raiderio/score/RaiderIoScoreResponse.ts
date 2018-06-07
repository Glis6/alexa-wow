import {RaiderIoScoreRequest} from "./RaiderIoScoreRequest";

export interface RaiderIoScoreResponse {
    request: RaiderIoScoreRequest;
    score: any;
    image: string;
}