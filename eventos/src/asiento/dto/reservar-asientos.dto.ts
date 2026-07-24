import { IsArray, ArrayMinSize, IsUUID } from 'class-validator';

export class ReservarAsientosDto {
  @IsArray()
  @ArrayMinSize(1)
 // @IsUUID('4', { each: true })
  asientoIds!: string[];
}