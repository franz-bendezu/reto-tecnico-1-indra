import { IAppointmentCreate } from "../../domain/interfaces/appointment-create";

export interface IAppointmentCountryProducer {
  sendAppointment(appointment: IAppointmentCreate): Promise<void>;
}
