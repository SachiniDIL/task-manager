import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { TasksService } from './tasks.service';

describe('TasksService', () => {
  let service: TasksService;
  const createTaskMock = jest.fn();
  const saveTaskMock = jest.fn();

  const mockTask = {
    id: 1,
    title: 'Learn NestJS',
    description: 'Practice unit testing',
    completed: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: getRepositoryToken(Task),
          useValue: {
            create: createTaskMock,
            save: saveTaskMock,
          },
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create and save a task', async () => {
    const createTaskDto = {
      title: 'Learn NestJS',
      description: 'Practice unit testing',
    };

    createTaskMock.mockReturnValue(mockTask);
    saveTaskMock.mockResolvedValue(mockTask);

    const result = await service.createTask(createTaskDto);

    expect(createTaskMock).toHaveBeenCalledWith(createTaskDto);
    expect(saveTaskMock).toHaveBeenCalledWith(mockTask);
    expect(result).toEqual(mockTask);
  });
});
