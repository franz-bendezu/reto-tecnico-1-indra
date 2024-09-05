import { AppointmentCountryConfig } from "./AppointmentCountryConfig";
import { IDatabaseConfig } from "./IAppointmentCountryConfig";

export class AppointmentPEConfig extends AppointmentCountryConfig {
  get rdsDatabase(): IDatabaseConfig {
    return {
      get proxyHostName(): string {
        return process.env.DB_PE_PROXY_HOST_NAME!;
      },
      get port(): number {
        return parseInt(process.env.DB_PE_PORT!);
      },
      get dbName(): string {
        return process.env.DB_PE_NAME!;
      },
      get dbUserName(): string {
        return process.env.DB_PE_USER_NAME!;
      },
    };
  }
}