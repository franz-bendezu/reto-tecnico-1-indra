import { IAppointmentCreate } from "../interfaces/appointment-create";

export interface IAppointmentService {
  createAppointment(appointment: IAppointmentCreate): Promise<void>;
}
