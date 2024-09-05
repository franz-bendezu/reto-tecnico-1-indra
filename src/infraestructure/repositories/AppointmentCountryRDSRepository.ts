import { IBaseAppointment } from "../../domain/interfaces/appointment";
import { Signer } from "@aws-sdk/rds-signer";
import mysql from "mysql2/promise";
import type { Connection } from "mysql2/promise";
import { IAppointmentCountryRepository } from "./IAppointmentCountryRepository";
import { IAppointmentCountryConfig } from "../config/IAppointmentCountryConfig";

// RDS settings

export class AppointmentCountryRDSRepository
  implements IAppointmentCountryRepository
{
  constructor(private config: IAppointmentCountryConfig) {}

  async createAuthToken(): Promise<string> {
    // Create RDS Signer object
    const dbConfig = this.config.rdsDatabase;
    const signer = new Signer({
      hostname: dbConfig.proxyHostName,
      port: dbConfig.port,
      region: this.config.awsRegion,
      username: dbConfig.dbUserName,
    });

    // Request authorization token from RDS, specifying the username
    const token = await signer.getAuthToken();
    return token;
  }

  async dbOps(): Promise<Connection> {
    // Obtain auth token
    const dbConfig = this.config.rdsDatabase;
    const token = await this.createAuthToken();
    const conn = await mysql.createConnection({
      host: dbConfig.proxyHostName,
      user: dbConfig.dbUserName,
      password: token,
      database: dbConfig.dbName,
      ssl: "Amazon RDS", // Ensure you have the CA bundle for SSL connection
    });
    return conn;
  }

  async create(appointment: IBaseAppointment): Promise<void> {
    const conn = await this.dbOps();
    const sql = `INSERT INTO appointments (insured_id, schedule_id, status, date) VALUES (?, ?, ?, ?)`;
    const values = [
      appointment.insuredId,
      appointment.scheduleId,
      appointment.lastStatus,
    ];
    await conn.execute(sql, values);
  }
}
