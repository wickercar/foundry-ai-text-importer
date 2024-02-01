import { Foundry5eMonster } from './schemas/foundry/monster/Foundry5eMonster';
import { parse5eMonsterDataFromText } from './text-parsing/parse5eMonsterDataFromText';
import genFoundry5eMonster from './foundry-parsing/genFoundry5eMonster';
import RunTimer from '../module/performanceUtils/RunTimer';

export const genFoundry5eMonsterFromTextBlock = async (text: string): Promise<Foundry5eMonster> => {
  const timer = RunTimer.getInstance();
  console.log(`Generating monster from text block, ${timer.timeElapsed()}s elapsed`);
  const parsedMonsterData = await parse5eMonsterDataFromText(text);
  console.log(`text parsed, ${timer.timeElapsed()} seconds elapsed`);
  const foundryMonster = await genFoundry5eMonster(parsedMonsterData);
  return foundryMonster;
};
