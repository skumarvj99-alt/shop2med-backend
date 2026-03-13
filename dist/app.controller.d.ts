import { HealthCheckService } from "@nestjs/terminus";
export declare class AppController {
    private readonly health;
    constructor(health: HealthCheckService);
    getHealth(): Promise<import("@nestjs/terminus").HealthCheckResult>;
}
