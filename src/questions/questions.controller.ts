import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorators';
import { RoleGuard } from '../auth/guards/role.guard';
import { UserRolesEnum } from '../constants/enums/UserRoles.enum';
import { QuestionDto } from './dto/question.dto';

@Controller('questions')
@UseGuards(JwtAuthGuard, RoleGuard)
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Post()
  @Roles(UserRolesEnum.ADMIN)
  async create(
    @Body() createQuestionDto: CreateQuestionDto,
  ): Promise<QuestionDto> {
    return this.questionsService.create(createQuestionDto);
  }

  @Get()
  @Roles(UserRolesEnum.ADMIN)
  async findAll(): Promise<QuestionDto[]> {
    return await this.questionsService.findAll();
  }

  @Get(':id')
  @Roles(UserRolesEnum.ADMIN)
  async findOne(@Param('id') id: string): Promise<QuestionDto> {
    return this.questionsService.findOne(id);
  }

  @Put(':id')
  @Roles(UserRolesEnum.ADMIN)
  async update(
    @Param('id') id: string,
    @Body() updateQuestionDto: UpdateQuestionDto,
  ): Promise<QuestionDto> {
    return this.questionsService.update(id, updateQuestionDto);
  }

  @Delete(':id')
  @Roles(UserRolesEnum.ADMIN)
  async remove(@Param('id') id: string): Promise<{ deleted: boolean }> {
    const deleted = await this.questionsService.remove(id);
    return { deleted };
  }
}
