import { ForbiddenException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DecodedUser } from "src/auth/decorators/user.decorator";
import { Contract } from "src/contract/entities/contract.entity";
import {
  ContractStatus,
  STATUS_TRANSITIONS,
} from "src/contract/enums/contract-status";
import { Repository } from "typeorm";
import { BadRequestException } from "@nestjs/common";

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Contract)
    private readonly contractRepository: Repository<Contract>
  ) {}

  async getAdminContracts(user: DecodedUser): Promise<any[]> {
    if (user.role !== "admin") {
      throw new ForbiddenException("Only admins can access all contracts");
    }

    const contracts = await this.contractRepository.find({
      relations: ["client"],
      order: { createdAt: "DESC" },
    });

    const sanitized = contracts.map(({ client, ...contract }) => {
      const { password, ...safeClient } = client;
      return {
        ...contract,
        client: safeClient,
        notes: contract.notes ?? [],
      };
    });

    return sanitized;
  }

  async updateContractStatus(
    id: string,
    updatedStatus: any
  ): Promise<{ message: string; success: boolean; status: string }> {
    const contract = await this.contractRepository.findOne({
      where: { id },
    });

    if (!contract) {
      throw new Error("Contract not found");
    }

    contract.status = updatedStatus.status;

    await this.contractRepository.save(contract);

    return {
      message: "Contract status updated successfully",
      success: true,
      status: updatedStatus.status,
    };
  }
}
