import type {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  SQSEvent,
  SQSHandler,
} from "aws-lambda";
import { appointmentSchema } from "../schemas/appointment";
import { AppointmentService } from "../../domain/services/AppointmentService";
import { AppointmentDynamoDBRepository } from "../../infraestructure/repositories/AppointmentDynamoDBRepository";
import { insuredIdSchema } from "../schemas/insured";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { z } from "zod";

const client = new DynamoDBClient();
const docClient = DynamoDBDocumentClient.from(client);
const appointmentRepository = new AppointmentDynamoDBRepository(docClient);
const serviceAppointment = new AppointmentService(appointmentRepository);

export const handler: APIGatewayProxyHandler | SQSHandler = async (
  event: SQSEvent | APIGatewayProxyEvent
) => {
  if ("Records" in event) {
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Hello from appointmentHandler" }),
    };
  } else if (event.httpMethod === "POST") {
    try {
      const data = appointmentSchema.parse(JSON.parse(event.body || "{}"));

      await serviceAppointment.createAppointment(data);
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
      const appointments = await serviceAppointment.getAppointmentsByInsuredId(
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
