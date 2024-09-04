import { IAppointmentCreate } from "../../domain/interfaces/appointment-create";
import { IAppointmentCountryProducer } from "./IAppointmentCountryProducer";
import {
  EventBridgeClient,
  PutEventsCommand,
} from "@aws-sdk/client-eventbridge";

export class AppointmentCountryProducer implements IAppointmentCountryProducer {
  constructor(private eventBridgeClient: EventBridgeClient) {}
  async sendAppointmentCountry(appointment: IAppointmentCreate): Promise<void> {
    const params = {
      Entries: [
        {
          Detail: JSON.stringify(appointment),
          DetailType: "AppointmentCountry",
          EventBusName: "appointmentCountry",
          Source: "appointmentCountry",
        },
      ],
    };
    await this.eventBridgeClient.send(new PutEventsCommand(params));
  }
}
