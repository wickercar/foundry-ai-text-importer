import { z } from 'zod';

// This represents the sections under the stat block, such as Actions, Legendary Actions, and Special Traits
export const BasicItemTypeSchema = z.enum([
  'specialTrait',
  'action',
  'reaction',
  'legendaryAction',
  'lairAction',
  'crewAction',
  'about',
]);

export type BasicItemType = z.infer<typeof BasicItemTypeSchema>;
