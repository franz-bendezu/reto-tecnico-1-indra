import { IAppointment } from "../../domain/interfaces/appointment";

import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  ScanCommand,
} from "@aws-sdk/lib-dynamodb";
import { IAppointmentRepository } from "./IAppointmentRepository";

export class AppointmentDynamoDBRepository implements IAppointmentRepository {
  private static tableName = "appointments";

  constructor(private docClient: DynamoDBDocumentClient) {}

  async create(appointment: IAppointment): Promise<void> {
    await this.docClient.send(
      new PutCommand({
        TableName: AppointmentDynamoDBRepository.tableName,
        Item: {
          ...appointment,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          statuses: [
            {
              status: appointment.lastStatus,
              date: new Date().toISOString(),
            },
          ],
        },
      })
    );
  }

  async getAllByEnsuranceId(insuredId: string): Promise<IAppointment[]> {
    const { Items = [] } = await this.docClient.send(
      new ScanCommand({
        TableName: AppointmentDynamoDBRepository.tableName,
        FilterExpression: "insuredId = :insuredId",
        ExpressionAttributeValues: {
          ":insuredId": insuredId,
        },
      })
    );

    return Items as IAppointment[];
  }

  async updateStatusById(id: string, status: string): Promise<void> {
    const { Item } = await this.docClient.send(
      new GetCommand({
        TableName: AppointmentDynamoDBRepository.tableName,
        Key: {
          id,
        },
      })
    );

    const existingStatuses = Item?.statuses || [];

    await this.docClient.send(
      new PutCommand({
        TableName: AppointmentDynamoDBRepository.tableName,
        Item: {
          ...Item,
          id,
          lastStatus: status,
          updatedAt: new Date().toISOString(),
          statuses: [
            ...existingStatuses,
            {
              status,
              date: new Date().toISOString(),
            },
          ],
        },
      })
    );
  }
}
