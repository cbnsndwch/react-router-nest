import { Controller, Get } from '@nestjs/common';

import { AppService } from '../services/index.js';

@Controller()
export class AppController {
    #appService: AppService;

    constructor(appService: AppService) {
        this.#appService = appService;
    }

    @Get('hello')
    getHello(): string {
        return this.#appService.getHello();
    }
}
