import { Injectable } from '@nestjs/common';
import { CreateEscenarioDto } from './dto/create-escenario.dto';
import { UpdateEscenarioDto } from './dto/update-escenario.dto';

@Injectable()
export class EscenarioService {
  create(createEscenarioDto: CreateEscenarioDto) {
    return 'This action adds a new escenario';
  }

  findAll() {
    return `This action returns all escenario`;
  }

  findOne(id: number) {
    return `This action returns a #${id} escenario`;
  }

  update(id: number, updateEscenarioDto: UpdateEscenarioDto) {
    return `This action updates a #${id} escenario`;
  }

  remove(id: number) {
    return `This action removes a #${id} escenario`;
  }
}
