import { IAppointmentCreate } from "../../domain/interfaces/appointment-create";
import { IAppointmentCountryConfig } from "../config/IAppointmentCountryConfig";
import { IAppointmentProducer } from "./IAppointmentProducer";
import {
  EventBridgeClient,
  PutEventsCommand,
} from "@aws-sdk/client-eventbridge";

export class AppointmentProducer implements IAppointmentProducer {
  constructor(private eventBridgeClient: EventBridgeClient, private config: IAppointmentCountryConfig ) {}
  async sendAppointmentCountry(appointment: IAppointmentCreate): Promise<void> {
    const eventBridgeConfig = this.config.eventBridge;
    const params = {
      Entries: [
        {
          Detail: JSON.stringify(appointment),
          DetailType: eventBridgeConfig.detailType,
          EventBusName: eventBridgeConfig.busName,
          Source: eventBridgeConfig.source,
        },
      ],
    };
    await this.eventBridgeClient.send(new PutEventsCommand(params));
  }
}
