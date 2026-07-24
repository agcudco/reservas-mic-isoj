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
  BadRequestException,
  Query,
  Logger,
} from '@nestjs/common';
import { AsientoService } from './asiento.service';
import { CreateAsientoDto } from './dto/create-asiento.dto';
import { UpdateAsientoDto } from './dto/update-asiento.dto';
import { ReservarAsientosDto } from './dto/reservar-asientos.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';
import { Public } from '../auth/decorators/public/public.decorator';
import { CurrentUser } from '../auth/decorators/current-user/current-user.decorator';

@Controller('asientos')
export class AsientoController {
  private readonly logger = new Logger(AsientoController.name);

  constructor(private readonly asientoService: AsientoService) {}

  // ============================================
  // 1️⃣ RUTAS FIJAS (sin parámetros variables)
  // ============================================

  // 🔒 Crear
  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createAsientoDto: CreateAsientoDto) {
    return this.asientoService.create(createAsientoDto);
  }

  // 🔓 Obtener todos (público)
  @Get()
  @Public()
  findAll() {
    return this.asientoService.findAll();
  }

  // 🔓 Obtener asientos de un evento (público)
  @Get('evento/:eventoId')
  @Public()
  async findByEvento(@Param('eventoId') eventoId: string) {
    return this.asientoService.findByEventoId(eventoId);
  }

  // 🔓 Obtener por IDs (público)
  @Get('by-ids')
  @Public()
  async findByIds(@Query('ids') ids: string) {
    if (!ids) {
      throw new BadRequestException('Se requiere el parámetro "ids"');
    }
    const asientoIds = ids.split(',');
    return this.asientoService.findManyByIds(asientoIds);
  }

  // ✅ RESERVAR ASIENTOS (consumido por microservicio de reservas)
  @Patch('reservar')
  @UseGuards(JwtAuthGuard)
  async reservarAsientos(
    @Body() dto: ReservarAsientosDto,
    @CurrentUser() user: any,
  ) {
    this.logger.log(`🔐 Reserva solicitada por usuario: ${user?.userId}`);
    this.logger.log(`📦 Asientos a reservar: ${dto.asientoIds.join(', ')}`);
    await this.asientoService.reservarAsientos(dto.asientoIds);
    return { message: 'Asientos reservados correctamente' };
  }

  // ✅ LIBERAR ASIENTOS (opcional)
  @Patch('liberar')
  @UseGuards(JwtAuthGuard)
  async liberarAsientos(
    @Body() dto: ReservarAsientosDto,
    @CurrentUser() user: any,
  ) {
    this.logger.log(`Liberación solicitada por usuario: ${user?.userId}`);
    await this.asientoService.liberarAsientos(dto.asientoIds);
    return { message: 'Asientos liberados correctamente' };
  }

  // ============================================
  // 2️⃣ RUTAS CON PARÁMETROS (:id)
  // ============================================

  // 🔓 Obtener un asiento por ID (público)
  @Get(':id')
  @Public()
  findOne(@Param('id') id: string) {
    return this.asientoService.findOne(id);
  }

  // 🔒 Actualizar (solo ADMIN)
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateAsientoDto: UpdateAsientoDto) {
    return this.asientoService.update(id, updateAsientoDto);
  }

  // 🔒 Eliminar (solo ADMIN)
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.asientoService.remove(id);
  }
}