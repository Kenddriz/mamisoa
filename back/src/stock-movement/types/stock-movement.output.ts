import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Meta } from '../../shared/shared.dto';
import { StockMovement } from '../stock-movement.entity';
import { Sale } from '../../sale/sale.entity';
import { Batch } from '../../batch/batch.entity';

@ObjectType()
export class StockMovementPagination {
  @Field(() => [StockMovement])
  items: StockMovement[];

  @Field(() => Meta)
  meta: Meta;
}

@ObjectType()
export class CancelSaleLineOutput {
  @Field(() => Sale)
  sale: Sale;
  @Field(() => [Batch])
  batches: Batch[];
}
@ObjectType()
export class MonthlyMovementsOutput {
  @Field(() => Int)
  medicineId: number;
  @Field(() => Int)
  in: number;
  @Field(() => Int)
  out: number;
  @Field(() => Int)
  stock: number;
}
