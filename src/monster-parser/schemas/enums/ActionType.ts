import { z } from 'zod';

export const ActionTypeEnumSchema = z.enum(['other', 'msak', 'heal', 'mwak', 'abil', 'rwak', 'util', 'rsak', 'save']);
export type ActionType = z.infer<typeof ActionTypeEnumSchema>;
