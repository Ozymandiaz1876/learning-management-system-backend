import { Injectable } from '@nestjs/common';
import { Command } from 'nestjs-command';
import { QuestionsService } from 'src/questions/questions.service';

@Injectable()
export class QuestionsSeed {
  constructor(private readonly questionsService: QuestionsService) {}

  @Command({
    command: 'seed:questions',
    describe: 'Seed questions',
  })
  async create() {
    const questionsToInsert = [];
    for (let i = 1; i <= 30; i++) {
      const difficulty = Math.floor(Math.random() * 10) + 1;
      const options = [
        { text: 'A', isCorrect: i % 2 === 0 },
        { text: 'B', isCorrect: !(i % 2 === 0) },
        { text: 'C', isCorrect: false },
        { text: 'D', isCorrect: false },
      ];
      questionsToInsert.push({
        questionText: `Question ${i}`,
        difficulty,
        options,
        createdBy: '66d5a135cea5fb5c13091b3c',
      });
    }

    console.log(questionsToInsert);
    await this.questionsService.createMany(questionsToInsert);
  }
}
