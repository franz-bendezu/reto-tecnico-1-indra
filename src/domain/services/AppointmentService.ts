import { IAppointmentRepository } from "../../infraestructure/repositories/IAppointmentRepository";
import { IBaseAppointment } from "../interfaces/appointment";
import { IAppointmentCreate } from "../interfaces/appointment-create";
import { AppointmentStatusType } from "../models/AppointmentStatus";
import { IAppointmentService } from "./IAppointmentService";

export class AppointmentService implements IAppointmentService {
  constructor(private appointmentRepository: IAppointmentRepository) {}

  async createAppointment(newAppointment: IAppointmentCreate): Promise<void> {
    const appointment: IBaseAppointment = {
      insuredId: newAppointment.insuredId,
      scheduleId: newAppointment.scheduleId,
      countryISO: newAppointment.countryISO,
      lastStatus: AppointmentStatusType.PENDING,
    };
    await this.appointmentRepository.create(appointment);
  }

  async getAppointmentsByInsuredId(
    insuredId: string
  ): Promise<IBaseAppointment[]> {
    return this.appointmentRepository.getAllByEnsuranceId(insuredId);
  }

  async completeAppointment(
    insuredId: string,
    scheduleId: number
  ): Promise<void> {
    await this.appointmentRepository.updateStatusById(
      insuredId,
      scheduleId,
      AppointmentStatusType.COMPLETED
    );
  }
}
