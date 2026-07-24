import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FilaService } from './fila.service';
import { CreateFilaDto } from './dto/create-fila.dto';
import { UpdateFilaDto } from './dto/update-fila.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles/roles.guard';
import { Roles } from '../auth/decorators/roles/roles.decorator';

@Controller('fila')
@UseGuards(JwtAuthGuard, RolesGuard)
export class FilaController {
  constructor(private readonly filaService: FilaService) {}

  @Post()
  @Roles('ADMIN', 'RECAUDADOR')
  create(@Body() createFilaDto: CreateFilaDto) {
    return this.filaService.create(createFilaDto);
  }

  @Get()
  //@Public()
  findAll() {
    return this.filaService.findAll();
  }

  @Get(':id')
  //@Public()
  findOne(@Param('id') id: string) {
    return this.filaService.findOne(id);
  }

  @Patch(':id')
  @Roles('ADMIN', 'RECAUDADOR')
  update(@Param('id') id: string, @Body() updateFilaDto: UpdateFilaDto) {
    return this.filaService.update(id, updateFilaDto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.filaService.remove(id);
  }
}