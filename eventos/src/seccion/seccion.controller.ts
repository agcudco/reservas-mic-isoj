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
import { SeccionService } from './seccion.service';
import { CreateSeccionDto } from './dto/create-seccion.dto';
import { UpdateSeccionDto } from './dto/update-seccion.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles/roles.guard';
import { Roles } from '../auth/decorators/roles/roles.decorator';

@Controller('seccion')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SeccionController {
  constructor(private readonly seccionService: SeccionService) {}

  @Post()
  @Roles('ADMIN', 'RECAUDADOR') // Solo administradores y recaudadores pueden crear
  create(@Body() createSeccionDto: CreateSeccionDto) {
    return this.seccionService.create(createSeccionDto);
  }

  @Get()
  findAll() {
    return this.seccionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.seccionService.findOne(id);
  }

  @Patch(':id')
  @Roles('ADMIN', 'RECAUDADOR')
  update(@Param('id') id: string, @Body() updateSeccionDto: UpdateSeccionDto) {
    return this.seccionService.update(id, updateSeccionDto);
  }

  @Delete(':id')
  @Roles('ADMIN') // Solo administradores pueden eliminar
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.seccionService.remove(id);
  }
}
