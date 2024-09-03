import { IBaseAppointment } from "../../domain/interfaces/appointment";
import { AppointmentStatusTypes } from "../../domain/interfaces/appointment-status";

export interface IAppointmentRepository {
  create(appointment: IBaseAppointment): Promise<void>;

  getAllByEnsuranceId(insuredId: string): Promise<IBaseAppointment[]>;

  updateStatusById(
    insuredId: string,
    scheduleId: number,
    status: AppointmentStatusTypes
  ): Promise<void>;
}
