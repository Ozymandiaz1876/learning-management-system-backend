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
    const question = await this.questionsService.create(createQuestionDto);
    return this.questionsService.toQuestionDto(question);
  }

  @Get()
  @Roles(UserRolesEnum.ADMIN)
  async findAll(): Promise<QuestionDto[]> {
    const questions = await this.questionsService.findAll();
    return questions.map((question) =>
      this.questionsService.toQuestionDto(question),
    );
  }

  @Get(':id')
  @Roles(UserRolesEnum.ADMIN)
  async findOne(@Param('id') id: string): Promise<QuestionDto> {
    const question = await this.questionsService.findOne(id);
    return this.questionsService.toQuestionDto(question);
  }

  @Put(':id')
  @Roles(UserRolesEnum.ADMIN)
  async update(
    @Param('id') id: string,
    @Body() updateQuestionDto: UpdateQuestionDto,
  ): Promise<QuestionDto> {
    const question = await this.questionsService.update(id, updateQuestionDto);
    return this.questionsService.toQuestionDto(question);
  }

  @Delete(':id')
  @Roles(UserRolesEnum.ADMIN)
  async remove(@Param('id') id: string): Promise<{ deleted: boolean }> {
    const deleted = await this.questionsService.remove(id);
    return { deleted };
  }
}
