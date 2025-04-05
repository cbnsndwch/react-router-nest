import { AppService } from './app.service.js';

export * from './app.service.js';

export const services = [
    AppService,
    {
        provide: AppService.name,
        useClass: AppService
    }
];
