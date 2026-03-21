import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { {ENTITY_CLASS} } from './entities/{ENTITY_FILE}.entity';
import { {SERVICE_CLASS} } from './services/{SERVICE_FILE}.service';
import { {REPOSITORY_CLASS} } from './repositories/{REPOSITORY_FILE}.repository';
import { {CONTROLLER_CLASS} } from './controllers/{CONTROLLER_FILE}.controller';
{ADDITIONAL_IMPORTS}

/**
 * {ENTITY_NAME} Module
 * 
 * Encapsulates all {ENTITY_NAME} related functionality
 * - Entity: {ENTITY_CLASS}
 * - Service: {SERVICE_CLASS}
 * - Repository: {REPOSITORY_CLASS}
 * - Controller: {CONTROLLER_CLASS}
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([
      {ENTITY_CLASS},
      {ADDITIONAL_ENTITIES}
    ]),
    {ADDITIONAL_MODULES}
  ],
  controllers: [{CONTROLLER_CLASS}],
  providers: [{SERVICE_CLASS}, {REPOSITORY_CLASS}],
  exports: [{SERVICE_CLASS}],
})
export class {FEATURE_MODULE_CLASS} {}
