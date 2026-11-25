import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { TasksService } from './tasks.service';
import { NotFoundException } from '@nestjs/common';

describe('TasksService', () => {
  let service: TasksService;
  const createTaskMock = jest.fn();
  const saveTaskMock = jest.fn();
  const findTasksMock = jest.fn();
  const findTaskByIdMock = jest.fn();
  const removeTaskMock = jest.fn();

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
            find: findTasksMock,
            findOneBy: findTaskByIdMock,
            remove: removeTaskMock,
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

  it('should return all tasks', async () => {
    const mockTasks = [mockTask];

    findTasksMock.mockResolvedValue(mockTasks);

    const result = await service.getAllTasks();

    expect(findTasksMock).toHaveBeenCalled();
    expect(result).toEqual(mockTasks);
  });

  it('should return a task by ID', async () => {
    findTaskByIdMock.mockResolvedValue(mockTask);

    const result = await service.getTaskById(1);

    expect(findTaskByIdMock).toHaveBeenCalledWith({ id: 1 });
    expect(result).toEqual(mockTask);
  });

  it('should throw NotFoundException if task not found by ID', async () => {
    findTaskByIdMock.mockResolvedValue(null);

    await expect(service.getTaskById(999)).rejects.toThrow(NotFoundException);
    expect(findTaskByIdMock).toHaveBeenCalledWith({ id: 999 });
  });

  it('should update an existing task', async () => {
    const updateTaskDto = {
      completed: true,
    };

    findTaskByIdMock.mockResolvedValue({ ...mockTask });
    saveTaskMock.mockImplementation((task) => Promise.resolve(task));

    const result = await service.updateTask(1, updateTaskDto);

    expect(findTaskByIdMock).toHaveBeenCalledWith({ id: 1 });
    expect(saveTaskMock).toHaveBeenCalledWith({
      ...mockTask,
      completed: true,
    });
    expect(result.completed).toBe(true);
  });

  it('should throw NotFoundException when updating a non-existing task', async () => {
    findTaskByIdMock.mockResolvedValue(null);

    await expect(
      service.updateTask(999, { completed: true }),
    ).rejects.toThrow(NotFoundException);

    expect(findTaskByIdMock).toHaveBeenCalledWith({ id: 999 });
    expect(saveTaskMock).not.toHaveBeenCalled();
  });

  it('should delete an existing task', async () => {
    findTaskByIdMock.mockResolvedValue(mockTask);
    removeTaskMock.mockResolvedValue(mockTask);

    await service.deleteTask(1);

    expect(findTaskByIdMock).toHaveBeenCalledWith({ id: 1 });
    expect(removeTaskMock).toHaveBeenCalledWith(mockTask);
  });

  it('should throw NotFoundException when deleting a non-existing task', async () => {
    findTaskByIdMock.mockResolvedValue(null);

    await expect(service.deleteTask(999)).rejects.toThrow(NotFoundException);

    expect(findTaskByIdMock).toHaveBeenCalledWith({ id: 999 });
    expect(removeTaskMock).not.toHaveBeenCalled();
  });
});
