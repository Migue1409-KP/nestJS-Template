import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { LanguagesRepository } from "./repositories/languages.repostiry";
import { Language } from "./entities/languages.entity";
import { ParametersController } from "./parameters.controller";
import { ParametersService } from "./parameters.service";

@Module({
  imports: [TypeOrmModule.forFeature([Language])],
  controllers: [ParametersController],
  providers: [LanguagesRepository, ParametersService],
  exports: [LanguagesRepository, ParametersService],
})
export class ParametersModule {}
