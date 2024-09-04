import { SQSHandler } from "aws-lambda";
import { z } from "zod";
import { appointmentCreateSchema } from "../schemas/appointment";
import { AppointmentCLService } from "../../domain/services/AppointmentCLService";
import { AppointmentCountryProducer } from "../../infraestructure/messasing/AppointmentCountryProducer";
import { AppointmentRDSRepository } from "../../infraestructure/repositories/AppointmentRDSRepository";

const appointmentProducer = new AppointmentCountryProducer();
const appointmentCountryRepository = new AppointmentRDSRepository();
const appointmentService = new AppointmentCLService(
  appointmentCountryRepository,
  appointmentProducer
);

export const handler: SQSHandler = async (event) => {
  for (const record of event.Records) {
    try {
      const appointment = appointmentCreateSchema.parse(
        JSON.parse(record.body)
      );
      await appointmentService.createAppointment(appointment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error("Invalid appointment data", error.errors);
      } else {
        console.error("Error processing appointment", error);
      }
    }
  }
};
