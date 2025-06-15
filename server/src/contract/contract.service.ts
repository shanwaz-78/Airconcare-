import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  Req,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Contract } from "./entities/contract.entity";
import { CreateContractDto } from "./dto/create-contract.dto";
import { UpdateContractDto } from "./dto/update-contract.dto";
import { ContractStatus } from "./enums/contract-status";
import { Request } from "express";
import { DecodedUser } from "../auth/decorators/user.decorator";

@Injectable()
export class ContractService {
  constructor(
    @InjectRepository(Contract)
    private readonly contractRepository: Repository<Contract>
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
    newStatus: ContractStatus
  ): boolean {
    return this.validTransitions[currentStatus]?.includes(newStatus) || false;
  }

  async create(
    createContractDto: CreateContractDto,
    client: DecodedUser
  ): Promise<Contract> {
    const contract = this.contractRepository.create({
      ...createContractDto,
      clientId: client.sub,
      notes: createContractDto.notes ?? [],
    });

    return await this.contractRepository.save(contract);
  }

  async findAll(user: DecodedUser): Promise<any[]> {
    if (!user) {
      throw new ForbiddenException("User not found");
    }

    const whereCondition = user.role === "admin" ? {} : { clientId: user.sub };

    const contracts = await this.contractRepository.find({
      where: whereCondition,
      relations: ["client"],
      order: { createdAt: "DESC" },
    });

    return contracts.map(({ clientId, client, ...contract }) => {
      const { password, ...safeClient } = client;
      return {
        ...contract,
        client: safeClient,
      };
    });
  }

  async findOne(id: string, user: DecodedUser): Promise<any> {
    const contract = await this.contractRepository.findOne({
      where: { clientId: id },
      relations: ["client"],
    });

    if (!contract) {
      throw new NotFoundException("Contract not found");
    }

    if (user.role !== "admin" && contract.clientId !== user.sub) {
      throw new ForbiddenException("You can only view your own contracts");
    }

    const { clientId, client, ...rest } = contract;
    const { password, ...safeClient } = client;

    return {
      ...rest,
      client: safeClient,
    };
  }

  async update(
    id: string,
    updateContractDto: UpdateContractDto,
    user: DecodedUser
  ): Promise<any> {
    const contract = await this.findOne(id, user);

    if (updateContractDto.status) {
      if (!this.isTransitionValid(contract.status, updateContractDto.status)) {
        throw new BadRequestException(
          `Invalid status transition from ${contract.status} to ${updateContractDto.status}`
        );
      }

      if (
        updateContractDto.status === ContractStatus.QUOTE_SENT &&
        !updateContractDto.quoteAmount
      ) {
        throw new BadRequestException(
          "Quote amount is required when sending quote"
        );
      }

      if (
        updateContractDto.status === ContractStatus.SERVICE_SCHEDULED &&
        !updateContractDto.serviceDate
      ) {
        throw new BadRequestException(
          "Service date is required when scheduling service"
        );
      }
    }

    if (updateContractDto.notes) {
      contract.notes = (contract.notes || []).concat(updateContractDto.notes);
    }

    const updated = await this.contractRepository.save({
      ...contract,
      ...updateContractDto,
    });

    const { clientId, client, ...rest } = updated;
    const { password, ...safeClient } = client;

    return {
      ...rest,
      client: safeClient,
    };
  }

  async remove(id: string, user: DecodedUser): Promise<void> {
    const contract = await this.findOne(id, user);
    await this.contractRepository.remove(contract);
  }

  async acceptQuote(id: string, user: DecodedUser): Promise<Contract> {
    const contract = await this.findOne(id, user);

    if (contract.status !== ContractStatus.QUOTE_SENT) {
      throw new BadRequestException(
        'Only contracts with status "Quote Sent" can be accepted'
      );
    }

    if (contract.clientId !== user.sub) {
      throw new ForbiddenException("You can only accept your own quotes");
    }

    contract.status = ContractStatus.ACCEPTED_BY_CLIENT;
    return await this.contractRepository.save(contract);
  }

  async completePayment(id: string, user: DecodedUser): Promise<Contract> {
    const contract = await this.findOne(id, user);

    if (contract.status !== ContractStatus.ACCEPTED_BY_CLIENT) {
      throw new BadRequestException(
        'Only contracts with status "Accepted by Client" can proceed to payment'
      );
    }

    if (contract.clientId !== user.sub) {
      throw new ForbiddenException("You can only pay for your own contracts");
    }

    contract.status = ContractStatus.PAYMENT_COMPLETED;
    return await this.contractRepository.save(contract);
  }
}
