import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Medicine } from './medicine.entity';
import { Repository } from 'typeorm';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { PaginationInput } from '../shared/shared.input';

@Injectable()
export class MedicineService {
  constructor(
    @InjectRepository(Medicine) private repository: Repository<Medicine>,
  ) {}
  async save(medicine: Medicine): Promise<Medicine> {
    return this.repository.save(medicine);
  }
  async findOne(id: number): Promise<Medicine> {
    return this.repository.findOne(id);
  }
  async findByIds(ids: number[]): Promise<Medicine[]> {
    return this.repository.findByIds(ids);
  }
  async count(): Promise<number> {
    return this.repository.count();
  }
  async paginateDeleted(input: PaginationInput): Promise<Pagination<Medicine>> {
    const query = this.repository
      .createQueryBuilder('med')
      .where('med.archivedAt IS NOT NULL')
      .withDeleted()
      .orderBy('med.archivedAt', 'DESC');
    return paginate(query, { ...input });
  }
  async findOneWithChildren(id: number): Promise<Medicine> {
    return this.repository.findOne(id, {
      relations: ['commandLines'],
    });
  }
  async softRemove(pro: Medicine): Promise<Medicine> {
    return this.repository.softRemove(pro);
  }
  async restore(id: number): Promise<boolean> {
    const query = await this.repository.restore(id);
    return query.affected > 0;
  }
  async remove(id: number): Promise<boolean> {
    const query = await this.repository.delete(id);
    return query.affected > 0;
  }
  async paginate(input: PaginationInput): Promise<Pagination<Medicine>> {
    const query = this.repository
      .createQueryBuilder('med')
      .where('med.label ILIKE :label', { label: `%${input.keyword}%` })
      .orderBy('med.label', 'ASC');
    return paginate(query, { ...input });
  }
}
