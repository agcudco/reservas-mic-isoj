import { Injectable } from '@nestjs/common';
import { CreateFilaDto } from './dto/create-fila.dto';
import { UpdateFilaDto } from './dto/update-fila.dto';

@Injectable()
export class FilaService {
  create(createFilaDto: CreateFilaDto) {
    return 'This action adds a new fila';
  }

  findAll() {
    return `This action returns all fila`;
  }

  findOne(id: number) {
    return `This action returns a #${id} fila`;
  }

  update(id: number, updateFilaDto: UpdateFilaDto) {
    return `This action updates a #${id} fila`;
  }

  remove(id: number) {
    return `This action removes a #${id} fila`;
  }
}
