// src/test/test.controller.ts
import { Controller, Get } from '@nestjs/common';

@Controller('test')
export class TestController {
  @Get()
  publico() {
    return { message: 'Público' };
  }
}
