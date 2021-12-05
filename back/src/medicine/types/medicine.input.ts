import { InputType, Field, Int, Float } from '@nestjs/graphql';

@InputType()
export class CreateMedicineInput {
  @Field(() => String)
  label: string;

  @Field(() => Int)
  packagingId: number;

  @Field(() => Float)
  currentSalePrice: number;

  @Field(() => Float)
  currentVat: number;
}

@InputType()
export class UpdateMedicineInput {
  @Field(() => Int)
  id: number;
  @Field(() => CreateMedicineInput)
  form: CreateMedicineInput;
}
