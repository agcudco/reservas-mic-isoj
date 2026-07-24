import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { isAxiosError } from 'axios';
import { AsientoResponseDto } from './dto/evento-response.dto';

@Injectable()
export class EventosClientService {
  private readonly baseUrl: string;
  private readonly logger = new Logger(EventosClientService.name);

  constructor(private configService: ConfigService) {
    this.baseUrl =
      this.configService.get<string>('EVENTOS_SERVICE_URL') ??
      'http://localhost:3000';
    this.logger.log(`🔗 EVENTOS_SERVICE_URL: ${this.baseUrl}`);
  }

  async findAsientosByEvento(eventoId: string): Promise<AsientoResponseDto[]> {
    if (!eventoId) {
      this.logger.error(
        '❌ findAsientosByEvento llamado con eventoId undefined',
      );
      return [];
    }
    try {
      const response = await axios.get(
        `${this.baseUrl}/asientos/evento/${eventoId}`,
        {
          timeout: 5000,
        },
      );
      this.logger.log(
        `✅ Asientos obtenidos del evento ${eventoId}: ${response.data.length}`,
      );
      return response.data;
    } catch (error) {
      this.logger.error(
        `❌ Error al obtener asientos: ${(error as Error).message}`,
      );
      throw new HttpException(
        'Error al consultar los asientos del evento',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }

  async reservarAsientos(
    asientoIds: string[],
    userToken?: string,
  ): Promise<void> {
    if (!userToken) {
      this.logger.error('❌ Token de usuario no proporcionado');
      throw new HttpException(
        'Token de usuario no proporcionado',
        HttpStatus.UNAUTHORIZED,
      );
    }
    const url = `${this.baseUrl}/asientos/reservar`; // ✅ Correcto
    this.logger.log(`🌐 URL de reserva: ${url}`);

    this.logger.log(`📦 Intentando reservar ${asientoIds.length} asientos`);
    try {
      const response = await axios.patch(
        `${this.baseUrl}/asientos/reservar`,
        { asientoIds },
        {
          timeout: 5000,
          headers: {
            Authorization: `Bearer ${userToken}`,
            'Content-Type': 'application/json',
          },
        },
      );
      this.logger.log(
        `✅ Reserva exitosa en eventos, status: ${response.status}`,
      );
    } catch (error) {
      if (isAxiosError(error)) {
        const status = error.response?.status;
        const data = error.response?.data as any;
        this.logger.error(
          `❌ Error al reservar en eventos: ${status} - ${JSON.stringify(data)}`,
        );
        if (status === 401) {
          throw new HttpException(
            'Token inválido o expirado',
            HttpStatus.UNAUTHORIZED,
          );
        }
        if (status === 403) {
          throw new HttpException(
            'No tiene permisos para reservar',
            HttpStatus.FORBIDDEN,
          );
        }
        if (status === 409) {
          throw new HttpException(
            'Algunos asientos ya no están disponibles',
            HttpStatus.CONFLICT,
          );
        }
        throw new HttpException(
          data?.message || 'Error al reservar los asientos',
          status || HttpStatus.SERVICE_UNAVAILABLE,
        );
      }
      throw new HttpException(
        'Error inesperado al reservar',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
