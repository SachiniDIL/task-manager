import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from './entities/task.entity';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(
    @Body() createTaskDto: CreateTaskDto,
  ): Promise<Task> {
    return this.tasksService.createTask(createTaskDto);
  }

  @Get()
  getAll(): Promise<Task[]> {
    return this.tasksService.getAllTasks();
  }

  @Get(':id')
  getById(@Param('id', ParseIntPipe) id: number): Promise<Task> {
    return this.tasksService.getTaskById(id);
  }
}