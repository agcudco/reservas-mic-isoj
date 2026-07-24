import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { EventoService } from './evento.service';
import { CreateEventoDto } from './dto/create-evento.dto';
import { UpdateEventoDto } from './dto/update-evento.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles/roles.guard';
import { Roles } from '../auth/decorators/roles/roles.decorator';

@Controller('evento')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EventoController {
  constructor(private readonly eventoService: EventoService) {}

  @Post()
  @Roles('ADMIN', 'RECAUDADOR')
  create(@Body() createEventoDto: CreateEventoDto) {
    return this.eventoService.create(createEventoDto);
  }

  @Get()
  @Roles('EMPLEADO', 'ADMIN', 'RECAUDADOR')
  findAll() {
    return this.eventoService.findAll();
  }

  @Get(':id')
  @Roles('EMPLEADO', 'ADMIN')
  findOne(@Param('id') id: string) {
    return this.eventoService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEventoDto: UpdateEventoDto) {
    return this.eventoService.update(+id, updateEventoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.eventoService.remove(+id);
  }
}
