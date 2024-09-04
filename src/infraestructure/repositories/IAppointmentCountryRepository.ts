import { IBaseAppointment } from "../../domain/interfaces/appointment";

export interface IAppointmentCountryRepository {
  create(appointment: IBaseAppointment): Promise<void>;
}
