import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';

import { AppService } from '../services/app.service';

import { AppController } from './app.controller';

describe('AppController', () => {
    let controller: AppController;
    let appService: AppService;

    beforeEach(async () => {
        // Create a mock AppService
        const mockAppService = {
            getHello: vi.fn().mockReturnValue('Hello Test!')
        };

        const moduleRef: TestingModule = await Test.createTestingModule({
            controllers: [AppController],
            providers: [
                {
                    provide: AppService,
                    useValue: mockAppService
                }
            ]
        }).compile();

        // Since AppController uses a private field with # syntax,
        // we need to directly instantiate it to test properly
        appService = moduleRef.get<AppService>(AppService);
        controller = new AppController(appService);
    });

    describe('getHello', () => {
        it('should return the result of appService.getHello', () => {
            const result = 'Hello Test!';
            expect(controller.getHello()).toBe(result);
            expect(appService.getHello).toHaveBeenCalled();
        });
    });
});
