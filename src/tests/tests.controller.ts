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
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorators';
import { RoleGuard } from '../auth/guards/role.guard';
import { UserRolesEnum } from '../constants/enums/UserRoles.enum';
import { TestResultsService } from 'src/results/results.service';
import { PayloadData } from 'src/auth/decorators/JwtPayload.decorator';
import { User } from 'src/users/users.model';
import { base64Decode } from 'src/utils';

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
    // some issue with express middleware coming after these requests, and not properly decoding
    const uniqueUrlIdDecoded = base64Decode(uniqueUrlId);

    return this.testsService.getTestDataByUniqueUrlId(uniqueUrlIdDecoded);
  }

  @Post(':testId/start')
  @UseGuards(JwtAuthGuard)
  async startTest(@Param('testId') testId: string, @PayloadData() data: User) {
    const userId = data._id?.toString();
    const firstQuestion = await this.testsService.startTest({ userId, testId });
    return firstQuestion;
  }

  @Post(':testId/questions/:questionId/answer')
  @UseGuards(JwtAuthGuard)
  async submitAnswer(
    @Param('testId') testId: string,
    @Param('questionId') questionId: string,
    @Body() answerDto: { answer: string },
    @PayloadData() data: User,
  ) {
    return this.testsService.submitAnswer({
      testId,
      questionId,
      answer: answerDto.answer,
      userId: data._id?.toString(),
    });
  }
}
