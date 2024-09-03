import { z } from "zod";
import { COUNTRIES_ISO } from "../../domain/constants/countries";
import { insuredIdSchema } from "./insured";

export const appointmentCreateSchema = z.object({
  insuredId: insuredIdSchema,
  scheduleId: z.number(),
  countryISO: z.enum(COUNTRIES_ISO),
});
