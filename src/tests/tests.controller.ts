import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { TestsService } from './tests.service';
import { CreateTestDto } from './dto/create-test.dto';
import { UpdateTestDto } from './dto/update-test.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RoleGuard } from '../auth/role.guard';
import { UserRolesEnum } from '../constants/enums/UserRoles.enum';

@Controller('tests')
export class TestsController {
  constructor(private readonly testsService: TestsService) {}

  // Admin Endpoints
  @Get()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(UserRolesEnum.ADMIN)
  getAllTests() {
    return this.testsService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(UserRolesEnum.ADMIN)
  getTestById(@Param('id') id: string) {
    return this.testsService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(UserRolesEnum.ADMIN)
  createTest(@Body() createTestDto: CreateTestDto) {
    return this.testsService.create(createTestDto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(UserRolesEnum.ADMIN)
  updateTest(@Param('id') id: string, @Body() updateTestDto: UpdateTestDto) {
    return this.testsService.update(id, updateTestDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(UserRolesEnum.ADMIN)
  deleteTest(@Param('id') id: string) {
    return this.testsService.remove(id);
  }

  // User Endpoints
  @Get('unique/:uniqueUrl')
  getTestByUniqueUrl(@Param('uniqueUrl') uniqueUrl: string) {
    return this.testsService.findByUniqueUrl(uniqueUrl);
  }

  @Post(':testId/start')
  @UseGuards(JwtAuthGuard)
  startTest(@Param('testId') testId: string) {
    // Add logic to start the test based on testId
  }

  @Post(':testId/questions/:questionId/answer')
  @UseGuards(JwtAuthGuard)
  submitAnswer(
    @Param('testId') testId: string,
    @Param('questionId') questionId: string,
    @Body() answerDto: { answer: string },
  ) {
    // Add logic to submit answer and get the next question
  }
}
