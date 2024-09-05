import {
  SNSClient,
  PublishCommand,
  PublishCommandInput,
} from "@aws-sdk/client-sns";
import { IAppointmentCountryProducer } from "./IAppointmentCountryProducer";
import { IAppointmentCreate } from "../../domain/interfaces/appointment-create";
import { IConfig } from "../config/IConfig";

export class AppointmentCountryProducer implements IAppointmentCountryProducer {
  constructor(private snsClient: SNSClient, private config: IConfig) {}
  async sendAppointment(appointment: IAppointmentCreate): Promise<void> {
    const snsConfig = this.config.sns;
    const params: PublishCommandInput = {
      Message: JSON.stringify(appointment),
      TopicArn:
        appointment.countryISO === "PE"
          ? snsConfig.topicArnPE
          : snsConfig.topicArnCL,
    };
    await this.snsClient.send(new PublishCommand(params));
  }
}
