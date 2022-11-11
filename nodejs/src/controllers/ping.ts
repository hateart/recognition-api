import { PingResponse } from "../business/ping-response.model";

export default class PingController {
    public async getMessage(): Promise<PingResponse> {
        return {
            message: 'pong',
        };
    }
}