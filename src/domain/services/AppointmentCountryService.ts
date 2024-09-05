import { IAppointmentProducer } from "../../infraestructure/messasing/IAppointmentProducer";
import { IAppointmentCountryRepository } from "../../infraestructure/repositories/IAppointmentCountryRepository";
import { IAppointmentCreate } from "../interfaces/appointment-create";
import { AppointmentStatusType } from "../models/AppointmentStatus";

export abstract class AppointmentCountryService {
  constructor(
    private appointmentCountryRepository: IAppointmentCountryRepository,
    private appointmentCountryProducer: IAppointmentProducer
  ) {}
  async createAppointment(appointment: IAppointmentCreate): Promise<void> {
    await this.appointmentCountryRepository.create({
      ...appointment,
      lastStatus: AppointmentStatusType.PENDING,
    });
    await this.appointmentCountryProducer.sendAppointmentCountry(appointment);
  }
}
