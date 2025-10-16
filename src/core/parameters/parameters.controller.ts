import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@thallesp/nestjs-better-auth';
import { ApiOperation, ApiResponse, ApiSecurity } from '@nestjs/swagger';
import { ApiSuccess } from '@/shared/interfaces/api-response';
import { ParametersService } from './parameters.service';
import { Language } from './entities/languages.entity';

@Controller('parameters')
@UseGuards(AuthGuard)
export class ParametersController {
    constructor(private readonly parametersService: ParametersService) {}

    @Get('languages')
    @ApiSecurity('cookieAuth')
    @ApiOperation({ summary: 'Get all languages' })
    @ApiResponse({ status: 200, description: 'Languages retrieved successfully.' })
    async getAllLanguages(): Promise<ApiSuccess<Language[]>> {
        return {
            status: 'success',
            data: await this.parametersService.findAllLanguages(),
        };
    }
}