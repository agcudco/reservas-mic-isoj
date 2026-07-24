import { IsString, IsUUID, IsOptional, IsEnum, Length } from 'class-validator';
import { TipoAsiento, EstadoAsiento } from '../entities/asiento.entity';

export class CreateAsientoDto {
  @IsString()
  @Length(1, 10)
  numero!: string; // ✅ Cambiado de 'nombre' a 'numero'

  @IsOptional()
  @IsEnum(TipoAsiento)
  tipo?: TipoAsiento;

  @IsOptional()
  @IsEnum(EstadoAsiento)
  estado?: EstadoAsiento;

  @IsUUID()
  filaId!: string;
}