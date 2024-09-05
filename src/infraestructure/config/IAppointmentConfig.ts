export interface ISnsConfig {
  get topicArnPE(): string;
  get topicArnCL(): string;
}

export interface IAppointmentConfig {
  get dynamoDBTableName(): string;
  get sns(): ISnsConfig;
}
