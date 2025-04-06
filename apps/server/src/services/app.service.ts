import { Injectable } from '@nestjs/common';

export const HELLO_MESSAGE = 'Hello React Router 7 from Nest!';

@Injectable()
export class AppService {
    getHello(): string {
        return HELLO_MESSAGE;
    }
}
