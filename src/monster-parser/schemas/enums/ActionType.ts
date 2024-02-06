import { z } from 'zod';

export const ActionTypeEnumSchema = z.enum(['other', 'msak', 'heal', 'mwak', 'abil', 'rwak', 'util', 'rsak', 'save'])
  .describe(`
  The type of action the item is.
  Use this key:
  melee weapon attack -> mwak
  ranged weapon attack -> rwak
  melee spell attack -> msak
  ranged spell attack -> rsak
  healing -> heal
  ability -> abil
  saving throw -> save
  utility -> util
  `);
export type ActionType = z.infer<typeof ActionTypeEnumSchema>;
