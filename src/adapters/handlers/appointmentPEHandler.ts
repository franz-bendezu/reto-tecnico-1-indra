import { SQSHandler } from "aws-lambda";
import { z } from "zod";
import { appointmentCreateSchema } from "../schemas/appointment";
import { AppointmentCountryProducer } from "../../infraestructure/messasing/AppointmentCountryProducer";
import { AppointmentCountryRDSRepository } from "../../infraestructure/repositories/AppointmentCountryRDSRepository";
import { AppointmentPEService } from "../../domain/services/AppointmentPEService";
import { EventBridgeClient } from "@aws-sdk/client-eventbridge";

const appointmentProducer = new AppointmentCountryProducer(
  new EventBridgeClient({})
);
const appointmentCountryRepository = new AppointmentCountryRDSRepository();
const appointmentService = new AppointmentPEService(
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
