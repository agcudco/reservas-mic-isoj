import { IsDateString, IsString, IsUUID } from 'class-validator';

export class CreateEventoDto {
  @IsString()
  nombre!: string;

  @IsString()
  descripcion!: string;

  @IsDateString()
  fecha!: string;

  @IsString()
  hora!: string;

  @IsUUID()
  escenarioId!: string;
}
