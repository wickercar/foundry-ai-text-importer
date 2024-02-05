import { z } from 'zod';
import { ActivationTypeEnumSchema } from '../../enums/ActivationType';
import { BasicItemTypeSchema } from '../../enums/BasicItemType';

export const Parsed5eMonsterBasicItemSchema = z.object({
  name: z.string(),
  text: z.string(),
  type: BasicItemTypeSchema,
  // .describe(
  //   'The type of item according to the section header. If there is no header, it is a special trait',
  // ),
});

export const Parsed5eMonsterBasicItemArraySchema = z.array(Parsed5eMonsterBasicItemSchema).describe(`
  An array of basic items, including actions, legendary actions, special traits, and others.
  This should contain everything after the initial stat block, which typically ends with Challenge or Damage Resistances
  Everything without a header is a special trait
`);

export type Parsed5eMonsterBasicItem = z.infer<typeof Parsed5eMonsterBasicItemSchema>;
