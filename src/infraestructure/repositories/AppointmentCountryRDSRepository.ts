import { IBaseAppointment } from "../../domain/interfaces/appointment";
import { Signer } from "@aws-sdk/rds-signer";
import mysql from "mysql2/promise";
import type { Connection } from "mysql2/promise";
import { IAppointmentCountryRepository } from "./IAppointmentCountryRepository";

// RDS settings
const proxy_host_name = process.env.PROXY_HOST_NAME!;
const port = parseInt(process.env.PORT!);
const db_name = process.env.DB_NAME!;
const db_user_name = process.env.DB_USER_NAME!;
const aws_region = process.env.AWS_REGION!;

export class AppointmentCountryRDSRepository implements IAppointmentCountryRepository {
  static async createAuthToken(): Promise<string> {
    // Create RDS Signer object
    const signer = new Signer({
      hostname: proxy_host_name,
      port: port,
      region: aws_region,
      username: db_user_name,
    });

    // Request authorization token from RDS, specifying the username
    const token = await signer.getAuthToken();
    return token;
  }

  async dbOps(): Promise<Connection> {
    // Obtain auth token
    const token = await AppointmentCountryRDSRepository.createAuthToken();
    const conn = await mysql.createConnection({
      host: proxy_host_name,
      user: db_user_name,
      password: token,
      database: db_name,
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
