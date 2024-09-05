import { IAppointment, IBaseAppointment } from "../../domain/interfaces/appointment";

import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  ScanCommand,
} from "@aws-sdk/lib-dynamodb";
import { IAppointmentRepository } from "./IAppointmentRepository";
import { IConfig } from "../config/IConfig";

export class AppointmentDynamoDBRepository implements IAppointmentRepository {

  constructor(private docClient: DynamoDBDocumentClient, private config: IConfig) {}

  async create(appointment: IBaseAppointment): Promise<void> {
    await this.docClient.send(
      new PutCommand({
        TableName: this.config.dynamoDBTableName,
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
        TableName: this.config.dynamoDBTableName,
        FilterExpression: "insuredId = :insuredId",
        ExpressionAttributeValues: {
          ":insuredId": insuredId,
        },
      })
    );

    return Items as IAppointment[];
  }

  async updateStatusById(
    insuredId: string,
    scheduleId: number,
    status: string
  ): Promise<void> {
    const { Item } = await this.docClient.send(
      new GetCommand({
        TableName: this.config.dynamoDBTableName,
        Key: {
          insuredId,
          scheduleId,
        },
      })
    );

    const existingStatuses = Item?.statuses || [];

    await this.docClient.send(
      new PutCommand({
        TableName: this.config.dynamoDBTableName,
        Item: {
          ...Item,
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
