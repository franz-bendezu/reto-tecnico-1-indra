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

export interface IAppointmentCountryConfig {
  get awsRegion(): string;
  get rdsDatabase(): IDatabaseConfig;
  get eventBridge(): IEventBridgeConfig;
}
