export class AsientoResponseDto {
  id!: string; // ✅ Campo obligatorio
  numero!: string;
  estado!: string;
  tipo!: string;
  fila?: {
    id: string;
    nombre: string;
    seccion?: any;
  };
}
