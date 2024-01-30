import { genFoundry5eMonsterFromTextBlock } from '../monster-parser/genFoundry5eMonsterFromTextBlock';
import { importFoundry5eMonsterToFoundry } from './importMonsterToFoundry';

const genFoundry5eMonsterActorFromTextBlock = async (textBlock): Promise<Actor> => {
  // Generate foundry monster from text block (goes through all intermediate steps)
  const monster = await genFoundry5eMonsterFromTextBlock(textBlock);
  // From the Foundry actor json, generate an actual foundry actor
  const actor = await importFoundry5eMonsterToFoundry(monster);
  // show the character sheet after importing
  actor.sheet?.render(true);
  return actor;
};

export default genFoundry5eMonsterActorFromTextBlock;
