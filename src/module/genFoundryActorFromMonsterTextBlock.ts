import foundryMonsterCompendia from '../monster-parser/foundry-compendia/foundryMonsterCompendia';
import { genFoundry5eMonsterFromTextBlock } from '../monster-parser/genFoundry5eMonsterFromTextBlock';
import { createFoundryActor } from './createFoundryActor';
import RunTimer from './performanceUtils/RunTimer';

const genFoundry5eMonsterActorFromTextBlock = async (textBlock): Promise<Actor> => {
  const timer = RunTimer.getInstance();
  timer.stop();
  timer.start();
  // Generate foundry monster from text block (goes through all intermediate steps)
  const monster = await genFoundry5eMonsterFromTextBlock(textBlock);
  console.log(`Foundry Monster generated from text, ${timer.timeElapsed()}s elapsed`);
  // From the Foundry actor json, generate an actual foundry actor
  const actor = await createFoundryActor(monster);
  console.log(`Foundry Actor created, ${timer.timeElapsed()}s elapsed`);
  // import the actor to the default compendium (will allow user to select compendium in the future)
  await foundryMonsterCompendia.saveAIImportedMonsterToCompendium(actor);
  // show the character sheet after importing
  actor.sheet?.render(true);
  console.log(`Actor sheet rendered, ${timer.timeElapsed()}s elapsed`);
  timer.stop();
  return actor;
};

export default genFoundry5eMonsterActorFromTextBlock;
