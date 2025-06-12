import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsDateString,
  IsOptional,
  Min,
  MaxLength,
  IsInt,
  IsUUID,
  IsEnum,
  IsArray,
} from 'class-validator';
import { ContractStatus } from '../enums/contract-status';

export class CreateContractDto {
  @IsUUID('4', { message: 'Client ID must be a valid UUID' })
  @IsNotEmpty({ message: 'Client ID is required' })
  clientId: string;

  @IsEnum(ContractStatus, { message: 'Invalid contract status' })
  @IsOptional()
  status?: ContractStatus;

  @IsString()
  @IsNotEmpty({ message: 'AC type is required' })
  @MaxLength(100, { message: 'AC type is too long' })
  acType: string;

  @IsInt({ message: 'Unit count must be an integer' })
  @Min(1, { message: 'At least one unit is required' })
  @IsNotEmpty({ message: 'Unit count is required' })
  unitCount: number;

  @IsString()
  @IsNotEmpty({ message: 'Address is required' })
  @MaxLength(255, { message: 'Address is too long' })
  address: string;

  @IsDateString({}, { message: 'Preferred date must be a valid date string' })
  @IsNotEmpty({ message: 'Preferred service date is required' })
  preferredDate: Date;

  @IsOptional()
  @IsDateString({}, { message: 'Service date must be a valid date string' })
  serviceDate?: Date;

  @IsOptional()
  @IsNumber({}, { message: 'Quote amount must be a number' })
  quoteAmount?: number;

  @IsOptional()
  @IsArray({ message: 'Notes must be an array of strings' })
  @IsString({ each: true, message: 'Each note must be a string' })
  notes?: string[];
}
