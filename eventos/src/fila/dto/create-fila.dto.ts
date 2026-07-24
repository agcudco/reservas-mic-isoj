import { IsString, IsOptional, IsInt, Min, IsUUID, Length } from 'class-validator';

export class CreateFilaDto {
  @IsString()
  @Length(1, 255)
  nombre!: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  capacidad?: number;

  @IsUUID()
  seccionId!: string; // ID de la sección a la que pertenece
}