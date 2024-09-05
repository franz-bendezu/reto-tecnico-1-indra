import { IAppointmentConfig, ISnsConfig } from "./IAppointmentConfig";

export class AppointmentConfigEnv implements IAppointmentConfig {
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
}
