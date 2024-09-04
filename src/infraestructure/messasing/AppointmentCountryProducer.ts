import { IAppointmentCreate } from "../../domain/interfaces/appointment-create";
import { IAppointmentCountryProducer } from "./IAppointmentCountryProducer";

// eventbridge
export class AppointmentCountryProducer implements IAppointmentCountryProducer {
  sendAppointmentCountry(appointment: IAppointmentCreate): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
