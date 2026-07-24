import { IsUUID, IsArray, ArrayMinSize, ArrayMaxSize, IsNotEmpty } from 'class-validator';

export class CreateReservationDto {
  @IsNotEmpty({ message: 'El eventoId es requerido' })
  //@IsUUID('4', { message: 'eventoId debe ser un UUID válido' })
  eventoId!: string;

  @IsArray({ message: 'asientoIds debe ser un arreglo' })
  @ArrayMinSize(1, { message: 'Debe seleccionar al menos un asiento' })
  @ArrayMaxSize(6, { message: 'Máximo 6 asientos por reserva' })
 // @IsUUID('4', { each: true, message: 'Cada asientoId debe ser un UUID válido' })
  asientoIds!: string[];
}