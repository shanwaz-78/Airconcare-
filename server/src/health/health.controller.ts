import { Controller, Get } from "@nestjs/common";
import { HealthService } from "./health.service";

@Controller("health")
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  checkHealth(): { message: string; success: boolean } {
    return { message: "Server is running", success: true };
  }
}
