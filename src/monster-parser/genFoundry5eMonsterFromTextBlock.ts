import { Foundry5eMonster } from './schemas/foundry/monster/Foundry5eMonster';
import genFoundry5eMonster from './foundry-parsing/genFoundry5eMonster';
import RunTimer from '../module/performanceUtils/RunTimer';
import MonsterTextBlock5eParser from './text-parsing/MonsterTextBlock5eParser/MonsterTextBlock5eParser';
import { Parsed5eLLMMonster } from './schemas/parsed-input-data/monster/Parsed5eMonster';

const MONSTER_TEXT_BLOCK_PARSER_STRATEGY = 'ONE_CALL';

export const genFoundry5eMonsterFromTextBlock = async (text: string): Promise<Foundry5eMonster> => {
  const timer = RunTimer.getInstance();
  console.log(`Generating monster from text block, ${timer.timeElapsed()}s elapsed`);
  const parsedMonsterData: Parsed5eLLMMonster = await MonsterTextBlock5eParser.parse(
    text,
    MONSTER_TEXT_BLOCK_PARSER_STRATEGY,
  );
  console.log(`text parsed, ${timer.timeElapsed()} seconds elapsed`);
  const foundryMonster = await genFoundry5eMonster(parsedMonsterData);
  return foundryMonster;
};
