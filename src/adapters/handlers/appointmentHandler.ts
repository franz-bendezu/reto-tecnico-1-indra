import type {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  SQSEvent,
  SQSHandler,
} from "aws-lambda";
import { appointmentCreateSchema } from "../schemas/appointment";
import { AppointmentService } from "../../domain/services/AppointmentService";
import { AppointmentDynamoDBRepository } from "../../infraestructure/repositories/AppointmentDynamoDBRepository";
import { insuredIdSchema } from "../schemas/insured";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { z } from "zod";
import { AppointmentCountryProducer } from "../../infraestructure/messasing/AppointmentCountryProducer";
import { SNSClient } from "@aws-sdk/client-sns";
import { ConfigEnv } from "../../infraestructure/config/ConfigEnv";

const config = new ConfigEnv();
const client = new DynamoDBClient();
const docClient = DynamoDBDocumentClient.from(client);
const appointmentRepository = new AppointmentDynamoDBRepository(
  docClient,
  config
);
const snsClient = new SNSClient({});
const appointmentCountryProducer = new AppointmentCountryProducer(
  snsClient,
  config
);
const appointmentService = new AppointmentService(
  appointmentRepository,
  appointmentCountryProducer
);

export const handler: APIGatewayProxyHandler | SQSHandler = async (
  event: SQSEvent | APIGatewayProxyEvent
) => {
  if ("Records" in event) {
    for (const record of event.Records) {
      const { insuredId, scheduleId } = JSON.parse(record.body);

      await appointmentService.completeAppointment(insuredId, scheduleId);
    }
  } else if (event.httpMethod === "POST") {
    try {
      const data = appointmentCreateSchema.parse(
        JSON.parse(event.body || "{}")
      );

      await appointmentService.createAppointment(data);
      return {
        statusCode: 200,
        body: JSON.stringify({ message: "Appointment created" }),
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          statusCode: 400,
          body: JSON.stringify({
            message: error.message,
            errors: error.errors.map((e) => e.message),
          }),
        };
      } else {
        return {
          statusCode: 500,
          body: JSON.stringify({ message: "Internal server error" }),
        };
      }
    }
  } else if (event.httpMethod === "GET") {
    try {
      const ensuredId = insuredIdSchema.parse(event.pathParameters?.ensuredId);
      const appointments = await appointmentService.getAppointmentsByInsuredId(
        ensuredId
      );

      return {
        statusCode: 200,
        body: JSON.stringify(appointments),
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          statusCode: 400,
          body: JSON.stringify({ message: error.message }),
        };
      } else {
        return {
          statusCode: 500,
          body: JSON.stringify({ message: "Internal server error" }),
        };
      }
    }
  }
  return {
    statusCode: 400,
    body: JSON.stringify({ message: "Bad request" }),
  };
};
