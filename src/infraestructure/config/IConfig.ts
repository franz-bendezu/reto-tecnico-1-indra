export interface IDatabaseConfig {
  get proxyHostName(): string;
  get port(): number;
  get dbName(): string;
  get dbUserName(): string;
}

export interface IEventBridgeConfig {
  get busName(): string;
  get source(): string;
  get detailType(): string;
}

export interface ISnsConfig {
  get topicArnPE(): string;
  get topicArnCL(): string;
}

export interface IConfig {
  get awsRegion(): string;
  get rdsDatabase(): IDatabaseConfig;
  get dynamoDBTableName(): string;
  get eventBridge(): IEventBridgeConfig;
  get sns(): ISnsConfig;
}
