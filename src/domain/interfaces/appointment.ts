import {
  AppointmentStatusTypes,
  IAppointmentStatus,
} from "./appointment-status";

export interface IAppointment {
  insuredId: string;
  scheduleId: number;
  countryISO: string;
  createdAt: string; // ISO 8601 date string
  updatedAt: string; // ISO 8601 date string
  notes?: string;
  lastStatus: AppointmentStatusTypes;
  statuses: IAppointmentStatus[];
}
