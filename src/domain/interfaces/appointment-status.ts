export type AppointmentStatusTypes = "pending" | "completed" | "cancelled";

export interface IAppointmentStatus {
  status: AppointmentStatusTypes;
  createdAt: string; // ISO 8601 date string
}
