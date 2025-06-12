import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  Req,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contract } from './entities/contract.entity';
import { User } from '../user/entities/user.entity';
import { CreateContractDto } from './dto/create-contract.dto';
import { UpdateContractDto } from './dto/update-contract.dto';
import { ContractStatus } from './enums/contract-status';
import { Request } from 'express';

@Injectable()
export class ContractService {
  constructor(
    @InjectRepository(Contract)
    private readonly contractRepository: Repository<Contract>,
  ) {}

  private validTransitions = {
    [ContractStatus.QUOTE_REQUESTED]: [ContractStatus.QUOTE_SENT],
    [ContractStatus.QUOTE_SENT]: [
      ContractStatus.ACCEPTED_BY_CLIENT,
      ContractStatus.QUOTE_REQUESTED,
    ],
    [ContractStatus.ACCEPTED_BY_CLIENT]: [ContractStatus.PAYMENT_COMPLETED],
    [ContractStatus.PAYMENT_COMPLETED]: [ContractStatus.SERVICE_SCHEDULED],
    [ContractStatus.SERVICE_SCHEDULED]: [ContractStatus.IN_PROGRESS],
    [ContractStatus.IN_PROGRESS]: [ContractStatus.COMPLETED],
  };

  private isTransitionValid(
    currentStatus: ContractStatus,
    newStatus: ContractStatus,
  ): boolean {
    return this.validTransitions[currentStatus]?.includes(newStatus) || false;
  }

  async create(
    createContractDto: CreateContractDto,
    client: User,
  ): Promise<Contract> {
    const contract = this.contractRepository.create({
      ...createContractDto,
      client,
      notes: createContractDto.notes ?? [],
    });

    return await this.contractRepository.save(contract);
  }

  async findAll(@Req() req: Request): Promise<Contract[]> {
    const { user } = req;
    if (!user) {
      throw new ForbiddenException('User not found in request');
    }
    if (user.role === 'admin') {
      return await this.contractRepository.find({ relations: ['client'] });
    }
    return await this.contractRepository.find({
      where: { client: { id: user.sub } },
      relations: ['client'],
    });
  }

  async findOne(id: string, user: User): Promise<Contract> {
    const contract = await this.contractRepository.findOne({
      where: { id },
      relations: ['client'],
    });

    if (!contract) {
      throw new NotFoundException('Contract not found');
    }

    if (user.role !== 'admin' && contract.client.id !== user.id) {
      throw new ForbiddenException('You can only view your own contracts');
    }

    return contract;
  }

  async update(
    id: string,
    updateContractDto: UpdateContractDto,
    user: User,
  ): Promise<Contract> {
    const contract = await this.findOne(id, user);

    if (updateContractDto.status) {
      if (!this.isTransitionValid(contract.status, updateContractDto.status)) {
        throw new BadRequestException(
          `Invalid status transition from ${contract.status} to ${updateContractDto.status}`,
        );
      }

      if (
        updateContractDto.status === ContractStatus.QUOTE_SENT &&
        !updateContractDto.quoteAmount
      ) {
        throw new BadRequestException(
          'Quote amount is required when sending quote',
        );
      }

      if (
        updateContractDto.status === ContractStatus.SERVICE_SCHEDULED &&
        !updateContractDto.serviceDate
      ) {
        throw new BadRequestException(
          'Service date is required when scheduling service',
        );
      }
    }

    if (updateContractDto.notes) {
      contract.notes = (contract.notes || []).concat(updateContractDto.notes);
    }

    const updatedContract = await this.contractRepository.save({
      ...contract,
      ...updateContractDto,
    });

    return updatedContract;
  }

  async remove(id: string, user: User): Promise<void> {
    const contract = await this.findOne(id, user);
    await this.contractRepository.remove(contract);
  }

  async acceptQuote(id: string, user: User): Promise<Contract> {
    const contract = await this.findOne(id, user);

    if (contract.status !== ContractStatus.QUOTE_SENT) {
      throw new BadRequestException(
        'Only contracts with status "Quote Sent" can be accepted',
      );
    }

    if (contract.client.id !== user.id) {
      throw new ForbiddenException('You can only accept your own quotes');
    }

    contract.status = ContractStatus.ACCEPTED_BY_CLIENT;
    return await this.contractRepository.save(contract);
  }

  async completePayment(id: string, user: User): Promise<Contract> {
    const contract = await this.findOne(id, user);

    if (contract.status !== ContractStatus.ACCEPTED_BY_CLIENT) {
      throw new BadRequestException(
        'Only contracts with status "Accepted by Client" can proceed to payment',
      );
    }

    if (contract.client.id !== user.id) {
      throw new ForbiddenException('You can only pay for your own contracts');
    }

    contract.status = ContractStatus.PAYMENT_COMPLETED;
    return await this.contractRepository.save(contract);
  }
}
