import {
  Args,
  Int,
  Mutation,
  Query,
  ResolveField,
  Resolver,
  Root,
} from '@nestjs/graphql';
import { MedicineService } from './medicine.service';
import { Medicine } from './medicine.entity';
import {
  CreateMedicineInput,
  UpdateMedicineInput,
} from './types/medicine.input';
import { uniqId } from '../utils';
import { PackagingService } from '../packaging/packaging.service';
import { Packaging } from '../packaging/packaging.entity';
import { BatchService } from '../batch/batch.service';
import { Batch } from '../batch/batch.entity';
import {
  MedicinePaginationOutput,
  MostConsumedMedicineOutput,
} from './types/medicine.output';
import { PaginationInput } from '../shared/shared.input';

@Resolver(() => Medicine)
export class MedicineResolver {
  constructor(
    private medicineService: MedicineService,
    private packagingService: PackagingService,
    private batchService: BatchService,
  ) {}

  @Mutation(() => Medicine)
  async createMedicine(
    @Args('input') input: CreateMedicineInput,
  ): Promise<Medicine> {
    const medicine = new Medicine();
    medicine.id = await uniqId('Medicine');
    return this.save(medicine, input);
  }
  @Mutation(() => Medicine)
  async updateMedicine(
    @Args('input') input: UpdateMedicineInput,
  ): Promise<Medicine> {
    const { id, form } = input;
    const medicine = await this.medicineService.findOne(id);
    return this.save(medicine, form);
  }
  /**Field resolvers*/
  @ResolveField(() => Packaging)
  async packaging(@Root() medicine: Medicine): Promise<Packaging> {
    return this.packagingService.findOneById(medicine.packagingId);
  }
  @ResolveField(() => [Batch])
  async batches(@Root() medicine: Medicine): Promise<Batch[]> {
    return this.batchService.findByMedicine(medicine.id);
  }
  private async save(
    medicine: Medicine,
    form: CreateMedicineInput,
  ): Promise<Medicine> {
    medicine.packaging = await this.packagingService.findOneById(
      form.packagingId,
    );
    Object.assign(medicine, form);
    return this.medicineService.save(medicine);
  }
  @Query(() => Int)
  async countMedicines() {
    return this.medicineService.count();
  }
  @ResolveField(() => Number)
  async stockTotal(@Root() medicine: Medicine) {
    return this.batchService.stockTotal(medicine.id);
  }
  @Query(() => [MostConsumedMedicineOutput])
  async mostConsumedMedicines(
    @Args({ name: 'year', type: () => Int }) year: number,
  ): Promise<MostConsumedMedicineOutput[]> {
    const batches: Array<{ medicine_id: number; count: number }> =
      await this.batchService.mostConsumed(year);
    const medicines = await this.medicineService.findByIds(
      batches.map((b) => b.medicine_id),
    );
    return medicines.map((medicine) => ({
      medicine,
      count: batches.find((b) => b.medicine_id === medicine.id).count,
    }));
  }
  @Query(() => MedicinePaginationOutput)
  async paginateDeletedMedicines(@Args('input') input: PaginationInput) {
    return this.medicineService.paginateDeleted(input);
  }
  @Query(() => MedicinePaginationOutput)
  async paginateMedicines(@Args('input') input: PaginationInput): Promise<MedicinePaginationOutput> {
    return this.medicineService.paginate(input);
  }
  @Mutation(() => Medicine)
  async softRemoveMedicine(
    @Args({ name: 'id', type: () => Int }) id: number,
  ): Promise<Medicine> {
    const med = await this.medicineService.findOneWithChildren(id);
    return this.medicineService.softRemove(med);
  }
  @Mutation(() => Boolean)
  async removeMedicine(@Args({ name: 'id', type: () => Int }) id: number) {
    return this.medicineService.remove(id);
  }
  @Mutation(() => Medicine, { nullable: true })
  async restoreMedicine(
    @Args({ name: 'id', type: () => Int }) id: number,
  ): Promise<Medicine> {
    await this.medicineService.restore(id);
    return this.medicineService.findOne(id);
  }
}
