import { IBaseAppointment } from "../../domain/interfaces/appointment";
import { AppointmentStatusTypes } from "../../domain/interfaces/appointment-status";

export interface IAppointmentRepository {
  create(appointment: IBaseAppointment): Promise<void>;

  getAllByEnsuranceId(insuredId: string): Promise<IBaseAppointment[]>;

  updateStatusById(id: string, status: AppointmentStatusTypes): Promise<void>;
}
