import { z } from 'zod';

export const CreateBetSchema = z.object({
  type: z.string(),
  amount: z.number().positive(),
  options: z.array(z.string())
});

export type CreateBetDto = z.infer<typeof CreateBetSchema>; 