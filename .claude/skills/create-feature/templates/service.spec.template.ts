import { Test, TestingModule } from '@nestjs/testing';
import { {SERVICE_CLASS} } from './{SERVICE_FILE}.service';
import { {REPOSITORY_CLASS} } from '../repositories/{REPOSITORY_FILE}.repository';
import { {ENTITY_CLASS} } from '../entities/{ENTITY_FILE}.entity';
import { NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';

describe('{SERVICE_CLASS}', () => {
  let service: {SERVICE_CLASS};
  let {REPO_PROPERTY}: {REPOSITORY_CLASS};
  let dataSource: DataSource;

  const mock{ENTITY_CLASS} = {
    id: '550e8400-e29b-41d4-a716-446655440000',
    // TODO: Add {ENTITY_NAME} properties
    createdAt: new Date('2026-03-21T10:00:00Z'),
    updatedAt: new Date('2026-03-21T10:00:00Z'),
  } as {ENTITY_CLASS};

  const mock{REPOSITORY_CLASS} = {
    findOneById: jest.fn(),
    findAll: jest.fn(),
    createEntity: jest.fn(),
    updateEntity: jest.fn(),
    softDeleteEntity: jest.fn(),
  };

  const mockDataSource = {
    transaction: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {SERVICE_CLASS},
        { provide: {REPOSITORY_CLASS}, useValue: mock{REPOSITORY_CLASS} },
        { provide: DataSource, useValue: mockDataSource },
      ],
    }).compile();

    service = module.get<{SERVICE_CLASS}>({SERVICE_CLASS});
    {REPO_PROPERTY} = module.get<{REPOSITORY_CLASS}>({REPOSITORY_CLASS});
    dataSource = module.get<DataSource>(DataSource);

    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('create{ENTITY_CLASS}', () => {
    it('should create and return new {ENTITY_NAME}', async () => {
      const createDto = {
        // TODO: Add create DTO properties
      };

      mock{REPOSITORY_CLASS}.createEntity.mockResolvedValue(mock{ENTITY_CLASS});

      const result = await service.create{ENTITY_CLASS}(createDto);

      expect(mock{REPOSITORY_CLASS}.createEntity).toHaveBeenCalledWith(createDto, undefined);
      expect(result).toEqual(mock{ENTITY_CLASS});
    });

    // TODO: Add more create test cases (validations, errors, etc.)
  });

  describe('find{ENTITY_CLASS}ById', () => {
    it('should return {ENTITY_NAME} when found', async () => {
      const id = '550e8400-e29b-41d4-a716-446655440000';

      mock{REPOSITORY_CLASS}.findOneById.mockResolvedValue(mock{ENTITY_CLASS});

      const result = await service.find{ENTITY_CLASS}ById(id);

      expect(mock{REPOSITORY_CLASS}.findOneById).toHaveBeenCalledWith(id);
      expect(result).toEqual(mock{ENTITY_CLASS});
    });

    it('should throw NotFoundException when {ENTITY_NAME} not found', async () => {
      const id = 'non-existent-id';

      mock{REPOSITORY_CLASS}.findOneById.mockResolvedValue(null);

      await expect(service.find{ENTITY_CLASS}ById(id)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll{ENTITY_PLURAL}', () => {
    it('should return array of {ENTITY_PLURAL}', async () => {
      const mockArray = [mock{ENTITY_CLASS}];

      mock{REPOSITORY_CLASS}.findAll.mockResolvedValue(mockArray);

      const result = await service.findAll{ENTITY_PLURAL}();

      expect(mock{REPOSITORY_CLASS}.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockArray);
    });

    it('should return empty array when no {ENTITY_PLURAL} exist', async () => {
      mock{REPOSITORY_CLASS}.findAll.mockResolvedValue([]);

      const result = await service.findAll{ENTITY_PLURAL}();

      expect(mock{REPOSITORY_CLASS}.findAll).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });

  describe('update{ENTITY_CLASS}', () => {
    it('should update and return updated {ENTITY_NAME}', async () => {
      const id = '550e8400-e29b-41d4-a716-446655440000';
      const updateDto = {
        // TODO: Add update DTO properties
      };
      const updated = { ...mock{ENTITY_CLASS}, ...updateDto };

      mock{REPOSITORY_CLASS}.findOneById.mockResolvedValue(mock{ENTITY_CLASS});
      mock{REPOSITORY_CLASS}.updateEntity.mockResolvedValue(updated);

      const result = await service.update{ENTITY_CLASS}(id, updateDto);

      expect(mock{REPOSITORY_CLASS}.findOneById).toHaveBeenCalledWith(id);
      expect(mock{REPOSITORY_CLASS}.updateEntity).toHaveBeenCalledWith(id, updateDto, undefined);
      expect(result).toEqual(updated);
    });

    it('should throw NotFoundException when {ENTITY_NAME} does not exist', async () => {
      const id = 'non-existent-id';
      const updateDto = {};

      mock{REPOSITORY_CLASS}.findOneById.mockResolvedValue(null);

      await expect(service.update{ENTITY_CLASS}(id, updateDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('delete{ENTITY_CLASS}', () => {
    it('should soft-delete {ENTITY_NAME}', async () => {
      const id = '550e8400-e29b-41d4-a716-446655440000';

      mock{REPOSITORY_CLASS}.findOneById.mockResolvedValue(mock{ENTITY_CLASS});
      mock{REPOSITORY_CLASS}.softDeleteEntity.mockResolvedValue(true);

      await service.delete{ENTITY_CLASS}(id);

      expect(mock{REPOSITORY_CLASS}.findOneById).toHaveBeenCalledWith(id, undefined);
      expect(mock{REPOSITORY_CLASS}.softDeleteEntity).toHaveBeenCalledWith(id, undefined);
    });

    it('should throw NotFoundException when {ENTITY_NAME} does not exist', async () => {
      const id = 'non-existent-id';

      mock{REPOSITORY_CLASS}.findOneById.mockResolvedValue(null);

      await expect(service.delete{ENTITY_CLASS}(id)).rejects.toThrow(NotFoundException);
    });
  });

  {CUSTOM_TESTS}
});
