import { z } from "zod";

export const insuredIdSchema = z.string().length(5);
