import {
  IsString,
  IsOptional,
  IsEnum,
  IsInt,
  Min,
  IsUUID,
  Length,
} from 'class-validator';
import { TipoSeccion } from '../entities/seccion.entity';

export class CreateSeccionDto {
  @IsString()
  @Length(1, 255)
  nombre!: string;

  @IsOptional()
  @IsString()
  @Length(0, 255)
  descripcion?: string;

  @IsOptional()
  @IsEnum(TipoSeccion)
  tipoSeccion?: TipoSeccion;

  @IsOptional()
  @IsInt()
  @Min(0)
  capacidad?: number;

  @IsUUID()
  escenarioId!: string; // ID del escenario al que pertenece
}
