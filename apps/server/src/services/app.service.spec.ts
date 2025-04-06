import { describe, it, expect, beforeEach } from 'vitest';

import { AppService } from './app.service';

describe('AppService', () => {
    let service: AppService;

    beforeEach(() => {
        service = new AppService();
    });

    describe('getHello', () => {
        it('should return "Hello World from Nest!"', () => {
            expect(service.getHello()).toBe('Hello World from Nest!');
        });
    });
});
