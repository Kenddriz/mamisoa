import { ObjectType, Field, Float, Int } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  RelationId,
  UpdateDateColumn,
} from 'typeorm';
import { Packaging } from '../packaging/packaging.entity';
import { Batch } from '../batch/batch.entity';
import { CommandLine } from '../command-line/command-line.entity';

@ObjectType()
@Entity({ name: 'medicines' })
export class Medicine {
  @Field()
  @PrimaryColumn()
  id: number;

  @Field()
  @Column({ type: 'varchar', unique: true })
  label: string;

  @Field(() => Packaging)
  @ManyToOne(() => Packaging, (packaging) => packaging.medicines, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  packaging: Packaging;
  @RelationId((medicine: Medicine) => medicine.packaging)
  packagingId: number;

  @Field(() => [Batch])
  @OneToMany(() => Batch, (batch) => batch.medicine, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  batches: Batch[];

  @Field(() => [CommandLine], { nullable: true })
  @OneToMany(() => CommandLine, (commandLine) => commandLine.medicine, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  commandLines: CommandLine[];

  @Field(() => Float)
  @Column({ type: 'float', default: 0 })
  currentSalePrice: number;

  @Field(() => Int, { defaultValue: 0 })
  stockTotal: number;
  /*current vat should be saved to have always access on it, even if some movement are deleted**/
  @Field(() => Float)
  @Column({ type: 'float', default: 0 })
  currentVat: number;

  @Field()
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @Field()
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @Field({ nullable: true })
  @DeleteDateColumn({ type: 'timestamp' })
  archivedAt?: Date;
}
