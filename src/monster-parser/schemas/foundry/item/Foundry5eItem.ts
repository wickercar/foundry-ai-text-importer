import { z } from 'zod';
import { FoundryMonsterStatsSchema, OwnershipSchema } from '../monster/FoundryMonster';

const PriceSchema = z.object({
  value: z.number().default(0),
  denomination: z.string().default('gp'),
});

export const Foundry5eItemSchema = z.object({
  _id: z.string().optional(),
  name: z.string(),
  type: z.string(),
  img: z.string(),
  /** Optional fields, consider taking off **/
  effects: z.array(z.string()).optional(),
  folder: z.null().optional(),
  sort: z.number().optional(),
  ownership: OwnershipSchema.optional(),
  flags: z.record(z.unknown()).optional(), // Adjust based on what 'flags' contains
  _stats: FoundryMonsterStatsSchema.optional(),
  /** End optional fields **/
  system: z
    .object({
      /**Optional fields thrown in to get types working */
      // quantity: z.number().default(1).optional(),
      // weight: z.number().default(0).optional(),
      // price: PriceSchema.optional(),
      // attunement: z.number().default(0).optional(),
      // equipped: z.boolean().default(true).optional(),
      // rarity: z.string().default('').optional(),
      // identified: z.boolean().default(true).optional(),
      /** End optional fields */
      description: z.object({
        value: z.string(),
        chat: z.string(),
        unidentified: z.string(),
      }),
      source: z.string(),
      activation: z.object({
        type: z.string(),
        cost: z.number().nullable(),
        condition: z.string(),
      }),
      duration: z.object({
        value: z.string(),
        units: z.string(),
      }),
      cover: z.number().nullable(),
      target: z.object({
        value: z.number().nullable(),
        width: z.number().nullable(),
        units: z.string(),
        type: z.string(),
      }),
      range: z.object({
        value: z.number().nullable(),
        long: z.number().nullable(),
        units: z.string(),
      }),
      uses: z.object({
        value: z.number().nullable(),
        max: z.string(),
        per: z.number().nullable(),
        recovery: z.string(),
      }),
      consume: z.object({
        type: z.string(),
        target: z.number().nullable(),
        amount: z.number().nullable(),
      }),
      ability: z.string().nullable(),
      actionType: z.string(),
      attackBonus: z.string(),
      chatFlavor: z.string(),
      critical: z.object({
        threshold: z.number().nullable(),
        damage: z.string(),
      }),
      damage: z.object({
        parts: z.array(z.tuple([z.string(), z.string()])),
        versatile: z.string(),
      }),
      formula: z.string(),
      save: z.object({
        ability: z.string(),
        dc: z.number().nullable(),
        scaling: z.enum(['spell']),
      }),
      type: z
        .object({
          value: z.string(),
          subtype: z.string(),
        })
        .optional(),
      requirements: z.string().optional(),
      recharge: z
        .object({
          value: z.number().nullable(),
          charged: z.boolean(),
        })
        .optional(),
    })
    .nonstrict(),
});

export type Foundry5eItem = z.infer<typeof Foundry5eItemSchema>;