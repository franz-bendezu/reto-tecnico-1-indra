import { AppointmentCountryConfig } from "./AppointmentCountryConfig";
import { IDatabaseConfig } from "./IAppointmentCountryConfig";

export class AppointmentCLConfig extends AppointmentCountryConfig {
  get rdsDatabase(): IDatabaseConfig {
    return {
      get proxyHostName(): string {
        return process.env.DB_PROXY_HOST_NAME!;
      },
      get port(): number {
        return parseInt(process.env.DB_PORT!);
      },
      get dbName(): string {
        return process.env.DB_NAME!;
      },
      get dbUserName(): string {
        return process.env.DB_USER_NAME!;
      },
    };
  }
}
