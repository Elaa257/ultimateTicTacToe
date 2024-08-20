import { Controller, Get, Res } from '@nestjs/common';
import { join } from 'path';
import { Response } from 'express';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('*')
  renderFrontend(@Res() res: Response) {
    res.sendFile(
      join(
        __dirname,
        '..',
        '..',
        '..',
        'ultimateTicTacToe',
        'frontend',
        'dist',
        'frontend',
        'browser',
        'index.html'
      )
    );
  }
}
