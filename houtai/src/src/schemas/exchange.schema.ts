import { z } from 'zod';

export const CreateExchangeSchema = z.object({
  cardId: z.string().uuid(),
  amount: z.number().positive(),
});

export const UpdateExchangeStatusSchema = z.object({
  status: z.enum(['PENDING', 'COMPLETED', 'FAILED']),
});

export type CreateExchangeDto = z.infer<typeof CreateExchangeSchema>;
export type UpdateExchangeStatusDto = z.infer<typeof UpdateExchangeStatusSchema>; 