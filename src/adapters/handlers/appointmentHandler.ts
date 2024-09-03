import type {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  SQSEvent,
  SQSHandler,
} from "aws-lambda";

export const handler: APIGatewayProxyHandler | SQSHandler = async (
  event: SQSEvent | APIGatewayProxyEvent
) => {
  if ("Records" in event) {
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Hello from appointmentHandler" }),
    };
  } else if (event.httpMethod === "POST") {
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Hello from appointmentHandler" }),
    };
  } else if (event.httpMethod === "GET") {
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Hello from appointmentHandler" }),
    };
  }
  return {
    statusCode: 400,
    body: JSON.stringify({ message: "Bad request" }),
  };
};
