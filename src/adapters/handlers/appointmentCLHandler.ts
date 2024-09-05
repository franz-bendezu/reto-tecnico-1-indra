import type { SQSHandler } from "aws-lambda";
import { z } from "zod";
import { appointmentCreateSchema } from "../schemas/appointment";
import { AppointmentCLService } from "../../domain/services/AppointmentCLService";
import { AppointmentCountryRDSRepository } from "../../infraestructure/repositories/AppointmentCountryRDSRepository";
import { EventBridgeClient } from "@aws-sdk/client-eventbridge";
import { AppointmentProducer } from "../../infraestructure/messasing/AppointmentProducer";
import { AppointmentCLConfig } from "../../infraestructure/config/AppointmentCLConfig";

const config = new AppointmentCLConfig();
const appointmentProducer = new AppointmentProducer(
  new EventBridgeClient({}),
  config
);
const appointmentCountryRepository = new AppointmentCountryRDSRepository(
  config
);
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
