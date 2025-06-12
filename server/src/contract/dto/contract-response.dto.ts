import { Exclude, Expose, Type } from 'class-transformer';
import { User } from '../../user/entities/user.entity';
import { ContractStatus } from '../enums/contract-status';

@Exclude()
export class ContractResponseDto {
  @Expose()
  id: string;

  @Expose()
  status: ContractStatus;

  @Expose()
  acType: string;

  @Expose()
  unitCount: number;

  @Expose()
  address: string;

  @Expose()
  preferredDate: Date;

  @Expose()
  serviceDate: Date;

  @Expose()
  quoteAmount: number;

  @Expose()
  notes: string[];

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  @Type(() => User)
  client: User;
}
