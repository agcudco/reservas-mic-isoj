import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
  Req,
  Logger,
} from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';

import type { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles/roles.guard';
import { Roles } from 'src/auth/decorators/roles/roles.decorator';
import { CurrentUser } from 'src/auth/decorators/current-user/current-user.decorator';

@Controller('reservas')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReservationsController {
  private readonly logger = new Logger(ReservationsController.name);
  constructor(private readonly reservationsService: ReservationsService) {}

  @Post()
  @Roles('CLIENTE', 'ADMIN')
  create(
    @Body() createReservationDto: CreateReservationDto,
    @CurrentUser() user: { userId: string },
    @Req() req: Request,
  ) {
    // Log para depurar qué llega en el body
    this.logger.log(
      `📥 Body recibido: ${JSON.stringify(createReservationDto)}`,
    );
    this.logger.log(`📥 EventoId extraído: ${createReservationDto.eventoId}`);
    this.logger.log(`📥 AsientoIds: ${createReservationDto.asientoIds}`);

    const token = req.headers.authorization?.split(' ')[1];
    this.logger.log(`🔑 Token extraído: ${token ? 'presente' : 'NO PRESENTE'}`);

    return this.reservationsService.create(
      createReservationDto,
      user.userId,
      token,
    );
  }

  @Get()
  @Roles('CLIENTE', 'ADMIN')
  findAll(@CurrentUser() user: { userId: string }) {
    return this.reservationsService.findAllByUser(user.userId);
  }

  @Get(':id')
  @Roles('CLIENTE', 'ADMIN')
  findOne(@Param('id') id: string, @CurrentUser() user: { userId: string }) {
    return this.reservationsService.findOne(id, user.userId);
  }

  @Delete(':id')
  @Roles('CLIENTE', 'ADMIN')
  @HttpCode(HttpStatus.NO_CONTENT)
  async cancel(
    @Param('id') id: string,
    @CurrentUser() user: { userId: string },
  ) {
    await this.reservationsService.cancel(id, user.userId);
  }
}
