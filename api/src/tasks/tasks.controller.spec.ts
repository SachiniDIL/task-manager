import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { Task } from './entities/task.entity';

describe('TasksController', () => {
  let controller: TasksController;
  const createTaskMock = jest.fn();

  const mockTask: Task = {
    id: 1,
    title: 'Learn NestJS',
    description: 'Practice controller testing',
    completed: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [
        {
          provide: TasksService,
          useValue: {
            createTask: createTaskMock,
          },
        },
      ],
    }).compile();

    controller = module.get<TasksController>(TasksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should pass the DTO to the service and return the created task', async () => {
    const createTaskDto = {
      title: 'Learn NestJS',
      description: 'Practice controller testing',
    };

    createTaskMock.mockResolvedValue(mockTask);

    const result = await controller.create(createTaskDto);

    expect(createTaskMock).toHaveBeenCalledWith(createTaskDto);
    expect(result).toEqual(mockTask);
  });
});
