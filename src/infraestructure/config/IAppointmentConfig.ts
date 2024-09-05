
export interface IAppointmentConfig {
  get dynamoDBTableName(): string;
  get snsTopicArn(): string;
}
