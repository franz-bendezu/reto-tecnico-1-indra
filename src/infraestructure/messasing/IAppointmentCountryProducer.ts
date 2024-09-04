import { IAppointmentCreate } from "../../domain/interfaces/appointment-create";

export interface IAppointmentCountryProducer {
  sendAppointmentCountry(appointment: IAppointmentCreate): Promise<void>;
}
