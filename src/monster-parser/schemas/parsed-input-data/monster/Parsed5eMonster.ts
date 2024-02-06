import { z } from 'zod';
import { Parsed5eMonsterAbilitiesSchema } from './Parsed5eMonsterAbilities';
import { AlignmentEnumSchema } from '../../enums/Alignment';
import { EnvironmentEnumSchema } from '../../enums/Environment';
import { Parsed5eMonsterBasicItemSchema } from './Parsed5eMonsterBasicItem';
import { Parsed5eMonsterBasicItemArraySchema } from './Parsed5eMonsterBasicItem';

export const Parsed5eMonsterBasicInfoSchema = z.object({
  name: z.string(),
  alignment: AlignmentEnumSchema,
  abilities: Parsed5eMonsterAbilitiesSchema,
  armorClass: z.object({
    value: z.number(),
    // TODO - make this enum better
    type: z.enum(['natural', 'armored']),
    formula: z.string().describe('e.g. "2d6+2"').default(''),
  }),
  xp: z.number().describe('experience points'),
  initiativeSkillCheck: z.object({
    ability: z.enum(['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma']),
    modifier: z.string().describe('e.g. "+3" or "-1"'),
  }),
  hitPoints: z.object({
    average: z.number(),
    formula: z.string().describe('e.g. "2d6+2"').default(''),
  }),
  movementSpeed: z.object({
    walk: z.number().describe('if only one speed is given, it is the walk speed'),
    fly: z.number(),
    swim: z.number(),
    burrow: z.number(),
    climb: z.number(),
  }),
  hover: z.boolean().default(false).describe('if the monster can hover'),
  skills: z
    .array(
      z.object({
        name: z.enum([
          'Strength',
          'Athletics',
          'Dexterity',
          'Acrobatics',
          'Sleight of Hand',
          'Stealth',
          'Intelligence',
          'Arcana',
          'History',
          'Investigation',
          'Nature',
          'Religion',
          'Wisdom',
          'Animal Handling',
          'Insight',
          'Medicine',
          'Perception',
          'Survival',
          'Charisma',
          'Deception',
          'Intimidation',
          'Performance',
          'Persuasion',
        ]),
        modifier: z.string().describe('eg. 3, -1, etc'),
      }),
    )
    .describe('array of skills proficiencies the monster has, usually labeled "skills"'),
  languages: z.array(z.string()).describe('array of languages the monster can speak'),
  race: z.string().describe('Only if applicable'),
  size: z.enum(['Tiny', 'Small', 'Medium', 'Large', 'Huge', 'Gargantuan']),
  // TODO - make this enum better
  type: z.enum([
    'aberration',
    'beast',
    'celestial',
    'construct',
    'dragon',
    'elemental',
    'fey',
    'fiend',
    'giant',
    'humanoid',
    'monstrosity',
    'ooze',
    'plant',
    'undead',
  ]),
  subtype: z.string(),
  isASwarm: z.boolean(),
  senses: z.object({
    darkvision: z.number(),
    blindsight: z.number(),
    tremorsense: z.number(),
    truesight: z.number(),
    passivePerception: z.number(),
    // TODO - are there more
  }),
  biography: z.string().describe('Story or description of the monster.'),
  environment: EnvironmentEnumSchema,
  damageImmunities: z.array(z.string()),
  damageResistances: z.array(z.string()),
  damageVulnerabilities: z.array(z.string()),
  conditionImmunities: z.array(z.string()),
  // type: z.object({
  //   type: z.object({
  //     value: z.string().describe('type of monster, e.g. "elemental"'),
  //     subtype: z.string().describe('subtype of monster, e.g. "swarm of insects"'),
  //     swarm: z.string().describe(hc('')),
  //     custom: z.string().describe(hc('')),
  //   }),
  // }),
  challengeRating: z.number().describe('challenge rating - whole number from 1 to 20 or fraction between 0 and 1'),
});

export type Parsed5eMonsterBasicInfo = z.infer<typeof Parsed5eMonsterBasicInfoSchema>;

/**
 *
 * The schema that will be returned by the llm
 */
// TODO - sync these enums with other schemas
export const Parsed5eLLMMonsterSchema = Parsed5eMonsterBasicInfoSchema.extend({
  basicItems: Parsed5eMonsterBasicItemArraySchema,
});

export type Parsed5eLLMMonster = z.infer<typeof Parsed5eLLMMonsterSchema>;
