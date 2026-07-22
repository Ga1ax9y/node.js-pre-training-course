import { Controller, Get, Post, Body, Param, Query, ParseIntPipe, Put, Delete, HttpCode, Patch, HttpStatus } from '@nestjs/common';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { TodoResponseDto } from './todo-response.dto';

@Controller('todos')
export class TodoController {
  constructor(private readonly todoService: TodoService) { }

  @Get()
  findAll(): Promise<TodoResponseDto[]> {
    return this.todoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<TodoResponseDto> {
    return this.todoService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateTodoDto): Promise<TodoResponseDto> {
    return this.todoService.create(dto);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTodoDto,
  ): Promise<TodoResponseDto> {
    return this.todoService.update(id, dto);
  }

  @Patch(':id/toggle')
  toggleStatus(@Param('id', ParseIntPipe) id: number): Promise<TodoResponseDto> {
    return this.todoService.toggleStatus(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.todoService.remove(id);
  }
}
