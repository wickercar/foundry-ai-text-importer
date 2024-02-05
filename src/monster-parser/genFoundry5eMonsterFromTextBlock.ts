import { Foundry5eMonster } from './schemas/foundry/monster/Foundry5eMonster';
import genFoundry5eMonster from './foundry-parsing/genFoundry5eMonster';
import RunTimer from '../module/performanceUtils/RunTimer';
import MonsterTextBlock5eParser from './text-parsing/MonsterTextBlock5eParser/MonsterTextBlock5eParser';
import { Parsed5eLLMMonster } from './schemas/parsed-input-data/monster/Parsed5eMonster';

type MonsterTextBlock5eParsingStrategy = 'ONE_CALL' | 'SEPARATE_ITEMS_AND_STATS';

export const genFoundry5eMonsterFromTextBlock = async (
  text: string,
  strategy: MonsterTextBlock5eParsingStrategy = 'ONE_CALL',
): Promise<Foundry5eMonster> => {
  const timer = RunTimer.getInstance();
  console.log(`Generating monster from text block, ${timer.timeElapsed()}s elapsed`);
  switch (MONSTER_TEXT_BLOCK_PARSER_STRATEGY) {
    case 'ONE_CALL':
      const parsedMonsterData: Parsed5eLLMMonster = await MonsterTextBlock5eParser.parseOneCall(text);
    case 'SEPARATE_ITEMS_AND_STATS':
      const parsedStatFieldsPromise = MonsterTextBlock5eParser.parseStatFields(text);
      const parsedItemNameAndTextFields = await MonsterTextBlock5eParser.parseItemNameAndTextFields(text);
    default:
      throw new Error(`Invalid strategy: ${strategy}`);
  }
  console.log(`text parsed, ${timer.timeElapsed()} seconds elapsed`);
  const foundryMonster = await genFoundry5eMonster(parsedMonsterData);
  return foundryMonster;
};
