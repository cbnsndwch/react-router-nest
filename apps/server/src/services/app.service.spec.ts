import { describe, it, expect, beforeEach } from 'vitest';

import { AppService, HELLO_MESSAGE } from './app.service';

describe('AppService', () => {
    let service: AppService;

    beforeEach(() => {
        service = new AppService();
    });

    describe('getHello', () => {
        it(`should return "${HELLO_MESSAGE}"`, () => {
            expect(service.getHello()).toBe(HELLO_MESSAGE);
        });
    });
});
