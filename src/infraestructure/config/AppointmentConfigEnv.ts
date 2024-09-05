import { IAppointmentConfig, IDatabaseConfig, IEventBridgeConfig, ISnsConfig } from "./IAppointmentConfig";

export class AppointmentConfigEnvv implements IAppointmentConfig {
  get sns(): ISnsConfig {
    return {
      get topicArnPE(): string {
        return process.env.SNS_TOPIC_ARN_PE!;
      },
      get topicArnCL(): string {
        return process.env.SNS_TOPIC_ARN_CL!;
      },
    };
  }
  get dynamoDBTableName(): string {
    return process.env.DYNAMODB_TABLE_NAME!;
  }
  get awsRegion(): string {
    return process.env.AWS_REGION!;
  }
  get rdsDatabase(): IDatabaseConfig {
    return {
      get proxyHostName(): string {
        return process.env.PROXY_HOST_NAME!;
      },
      get port(): number {
        return parseInt(process.env.PORT!);
      },
      get dbName(): string {
        return process.env.DB_NAME!;
      },
      get dbUserName(): string {
        return process.env.DB_USER_NAME!;
      },
    };
  }
  get eventBridge(): IEventBridgeConfig {
    return {
      get busName(): string {
        return process.env.EVENT_BUS_NAME!;
      },
      get source(): string {
        return process.env.EVENT_SOURCE!;
      },
      get detailType(): string {
        return process.env.EVENT_DETAIL_TYPE!;
      },
    };
  }
}
