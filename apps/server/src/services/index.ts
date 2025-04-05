import { AppService } from './app.service';

export * from './app.service';

export const services = [
    AppService,
    {
        provide: AppService.name,
        useClass: AppService
    }
];
