import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { TestsService } from './tests.service';
import { CreateTestDto } from './dto/create-test.dto';
import { UpdateTestDto } from './dto/update-test.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorators';
import { RoleGuard } from '../auth/guards/role.guard';
import { UserRolesEnum } from '../constants/enums/UserRoles.enum';
import { TestResultsService } from 'src/results/results.service';

@Controller('tests')
export class TestsController {
  constructor(
    private readonly testsService: TestsService,
    private readonly testResultsService: TestResultsService,
  ) {}

  // Admin Endpoints
  @Get()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(UserRolesEnum.ADMIN)
  getAllTests() {
    return this.testsService.findAll();
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

  @Get('id/:testId')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(UserRolesEnum.ADMIN)
  async getTestDataAndResultsByTestId(@Param('testId') testId: string) {
    const test = await this.testsService.findOne(testId);

    const results =
      await this.testResultsService.fetchAllResultsForTest(testId);
    return { test, results };
  }

  // User Endpoint
  @Get(':uniqueUrlId')
  @UseGuards(JwtAuthGuard)
  getTestDataByUniqueUrlId(@Param('uniqueUrlId') uniqueUrlId: string) {
    return this.testsService.getTestDataByUniqueUrlId(uniqueUrlId);
  }

  @Post(':testId/start')
  @UseGuards(JwtAuthGuard)
  async startTest(@Param('testId') testId: string, @Req() req: any) {
    const userId = req.user.userId;
    return this.testsService.startTest(userId, testId);
  }

  //   @Post(':testId/questions/:questionId/answer')
  //   @UseGuards(JwtAuthGuard)
  //   submitAnswer(
  //     @Param('testId') testId: string,
  //     @Param('questionId') questionId: string,
  //     @Body() answerDto: { answer: string },
  //   ) {
  //     // Add logic to submit answer and get the next question
  //   }
}
