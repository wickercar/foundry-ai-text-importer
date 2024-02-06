import { ZodArray, z } from 'zod';
import { Foundry5eItemSchema } from './Foundry5eItem';

const Foundry5eItemChunkSchemas = [
  Foundry5eItemSchema.pick({
    name: true,
    type: true,
  }),
  Foundry5eItemSchema.pick({}),
];
