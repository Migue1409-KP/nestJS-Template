import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiSecurity,
} from '@nestjs/swagger';
import { {SERVICE_CLASS} } from '../services/{SERVICE_FILE}.service';
import { {REPOSITORY_CLASS} } from '../repositories/{REPOSITORY_FILE}.repository';
import {
  Create{ENTITY_CLASS}Dto,
  Create{ENTITY_CLASS}SwaggerDto,
  Update{ENTITY_CLASS}Dto,
  Update{ENTITY_CLASS}SwaggerDto,
} from '../dto/index';
import { AuthGuard } from '@shared/guards/auth.guard';
import { ZodValidationPipe } from '@shared/pipes/zod-validation.pipe';
import {
  Create{ENTITY_CLASS}Schema,
  Update{ENTITY_CLASS}Schema,
} from '../dto/index';
import { ApiSuccess } from '@shared/interfaces/api-response';

/**
 * {ENTITY_NAME} Controller
 * 
 * HTTP endpoints for {ENTITY_DESCRIPTION}
 */
@Controller('{ROUTE_PREFIX}')
@ApiTags('{ENTITY_PLURAL}')
@UseGuards(AuthGuard)
@ApiSecurity('apiKeyAuth')
@ApiSecurity('cookieAuth')
export class {CONTROLLER_CLASS} {
  constructor(
    private readonly {SERVICE_PROPERTY}: {SERVICE_CLASS},
  ) {}

  /**
   * Create new {ENTITY_NAME}
   */
  @Post()
  @HttpCode(201)
  @ApiOperation({
    summary: 'Create {ENTITY_NAME}',
    description: 'Creates a new {ENTITY_NAME} with the provided data',
  })
  @ApiBody({ type: Create{ENTITY_CLASS}SwaggerDto })
  @ApiResponse({
    status: 201,
    description: '{ENTITY_NAME} created successfully',
    schema: {
      example: {
        status: 'success',
        data: {
          id: '550e8400-e29b-41d4-a716-446655440000',
          // ... {ENTITY_NAME} fields
          createdAt: '2026-03-21T10:00:00Z',
          updatedAt: '2026-03-21T10:00:00Z',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
  })
  async create(
    @Body(new ZodValidationPipe(Create{ENTITY_CLASS}Schema))
    body: Create{ENTITY_CLASS}Dto,
  ): Promise<ApiSuccess<{ENTITY_CLASS}>> {
    const data = await this.{SERVICE_PROPERTY}.create{ENTITY_CLASS}(body);
    return {
      status: 'success',
      data,
    };
  }

  /**
   * Get {ENTITY_NAME} by ID
   */
  @Get(':id')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Get {ENTITY_NAME}',
    description: 'Retrieves a {ENTITY_NAME} by its ID',
  })
  @ApiResponse({
    status: 200,
    description: '{ENTITY_NAME} retrieved successfully',
    schema: {
      example: {
        status: 'success',
        data: {
          id: '550e8400-e29b-41d4-a716-446655440000',
          // ... {ENTITY_NAME} fields
          createdAt: '2026-03-21T10:00:00Z',
          updatedAt: '2026-03-21T10:00:00Z',
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: '{ENTITY_NAME} not found',
  })
  async findOne(
    @Param('id') id: string,
  ): Promise<ApiSuccess<{ENTITY_CLASS}>> {
    const data = await this.{SERVICE_PROPERTY}.find{ENTITY_CLASS}ById(id);
    return {
      status: 'success',
      data,
    };
  }

  /**
   * List all {ENTITY_PLURAL}
   */
  @Get()
  @HttpCode(200)
  @ApiOperation({
    summary: 'List {ENTITY_PLURAL}',
    description: 'Retrieves all {ENTITY_PLURAL}',
  })
  @ApiResponse({
    status: 200,
    description: '{ENTITY_PLURAL} retrieved successfully',
    schema: {
      example: {
        status: 'success',
        data: [
          {
            id: '550e8400-e29b-41d4-a716-446655440000',
            // ... {ENTITY_NAME} fields
            createdAt: '2026-03-21T10:00:00Z',
            updatedAt: '2026-03-21T10:00:00Z',
          },
        ],
      },
    },
  })
  async findAll(): Promise<ApiSuccess<{ENTITY_CLASS}[]>> {
    const data = await this.{SERVICE_PROPERTY}.findAll{ENTITY_PLURAL}();
    return {
      status: 'success',
      data,
    };
  }

  /**
   * Update {ENTITY_NAME}
   */
  @Patch(':id')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Update {ENTITY_NAME}',
    description: 'Updates a {ENTITY_NAME} with the provided data',
  })
  @ApiBody({ type: Update{ENTITY_CLASS}SwaggerDto })
  @ApiResponse({
    status: 200,
    description: '{ENTITY_NAME} updated successfully',
    schema: {
      example: {
        status: 'success',
        data: {
          id: '550e8400-e29b-41d4-a716-446655440000',
          // ... {ENTITY_NAME} fields
          createdAt: '2026-03-21T10:00:00Z',
          updatedAt: '2026-03-21T10:00:00Z',
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: '{ENTITY_NAME} not found',
  })
  async update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(Update{ENTITY_CLASS}Schema))
    body: Update{ENTITY_CLASS}Dto,
  ): Promise<ApiSuccess<{ENTITY_CLASS}>> {
    const data = await this.{SERVICE_PROPERTY}.update{ENTITY_CLASS}(id, body);
    return {
      status: 'success',
      data,
    };
  }

  /**
   * Delete {ENTITY_NAME}
   */
  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({
    summary: 'Delete {ENTITY_NAME}',
    description: 'Deletes a {ENTITY_NAME} by its ID',
  })
  @ApiResponse({
    status: 204,
    description: '{ENTITY_NAME} deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: '{ENTITY_NAME} not found',
  })
  async remove(@Param('id') id: string): Promise<void> {
    await this.{SERVICE_PROPERTY}.delete{ENTITY_CLASS}(id);
  }

  {CUSTOM_ENDPOINTS}
}
