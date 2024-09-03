export type AppointmentStatusTypes = "pending" | "completed" | "cancelled";

export interface IAppointmentStatus {
  status: AppointmentStatusTypes;
  timestamp: string;
}
