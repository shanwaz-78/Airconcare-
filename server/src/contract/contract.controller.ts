import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  Req,
} from "@nestjs/common";
import { ContractService } from "./contract.service";
import { CreateContractDto } from "./dto/create-contract.dto";
import { UpdateContractDto } from "./dto/update-contract.dto";
import { RoleGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { UserRole } from "../user/enums/user-role";
import {
  User as CurrentUser,
  DecodedUser,
} from "../auth/decorators/user.decorator";

@Controller("contracts")
export class ContractController {
  constructor(private readonly contractService: ContractService) {}

  @Post("create")
  create(@Body() dto: CreateContractDto, @CurrentUser() user: DecodedUser) {
    return this.contractService.create(dto, user);
  }

  @Get("all")
  findAll(@CurrentUser() user: DecodedUser) {
    return this.contractService.findAll(user);
  }

  @Get(":id")
  findOne(@Param("id") id: string, @CurrentUser() user: DecodedUser) {
    return this.contractService.findOne(id, user);
  }

  @Put("update/:id")
  @Roles(UserRole.ADMIN)
  @UseGuards(RoleGuard)
  update(
    @Param("id") id: string,
    @Body() dto: UpdateContractDto,
    @CurrentUser() user: DecodedUser
  ) {
    return this.contractService.update(id, dto, user);
  }

  @Delete(":id")
  @Roles(UserRole.ADMIN)
  @UseGuards(RoleGuard)
  remove(@Param("id") id: string, @CurrentUser() user: DecodedUser) {
    return this.contractService.remove(id, user);
  }

  @Post(":id/accept-quote")
  acceptQuote(@Param("id") id: string, @CurrentUser() user: DecodedUser) {
    return this.contractService.acceptQuote(id, user);
  }

  @Post(":id/complete-payment")
  completePayment(@Param("id") id: string, @CurrentUser() user: DecodedUser) {
    return this.contractService.completePayment(id, user);
  }
}
