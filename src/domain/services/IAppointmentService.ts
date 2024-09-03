import { IBaseAppointment } from "../interfaces/appointment";
import { IAppointmentCreate } from "../interfaces/appointment-create";
import { AppointmentStatusType } from "../models/AppointmentStatus";

export interface IAppointmentService {
  createAppointment(appointment: IAppointmentCreate): Promise<void>;

  getAppointmentsByInsuredId(insuredId: string): Promise<IBaseAppointment[]>;

  completeAppointment(insuredId: string, scheduleId: number): Promise<void>;
}
