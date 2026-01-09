import { Module } from '@nestjs/common';

import { controllers } from './controllers/index.js';
import { services } from './services/index.js';

@Module({
    imports: [],
    controllers,
    providers: [...services]
})
export class AppModule {}
