import { z } from 'zod';

export const Warf5eMonsterAbilitySchema = z.object({
  value: z.number(),
  proficient: z.number(),
  bonuses: z
    .object({
      check: z.string(),
      save: z.string(),
    })
    .describe('bonuses to checks and saves'),
});

export type Warf5eMonsterAbility = z.infer<typeof Warf5eMonsterAbilitySchema>;

export const Warf5eMonsterAbilitiesSchema = z.object({
  str: Warf5eMonsterAbilitySchema,
  dex: Warf5eMonsterAbilitySchema,
  con: Warf5eMonsterAbilitySchema,
  int: Warf5eMonsterAbilitySchema,
  wis: Warf5eMonsterAbilitySchema,
  cha: Warf5eMonsterAbilitySchema,
});

export type Warf5eMonsterAbilities = z.infer<typeof Warf5eMonsterAbilitiesSchema>;
