import { Body, Controller, Get, Param, Put } from "@nestjs/common";
import { AdminService } from "./admin.service";
import {
  User as CurrentUser,
  DecodedUser,
} from "src/auth/decorators/user.decorator";
import { ContractStatus } from "../contract/enums/contract-status";

@Controller("admin")
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get("contracts")
  getAdminContracts(@CurrentUser() user: DecodedUser) {
    return this.adminService.getAdminContracts(user);
  }

  @Put(":id/status")
  updateContractStatus(
    @Param("id") id: string,
    @Body() updatedStatus: ContractStatus
  ) {
    return this.adminService.updateContractStatus(id, updatedStatus);
  }
}
