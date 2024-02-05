import { Parsed5eLLMMonster } from '../../schemas/parsed-input-data/monster/Parsed5eMonster';
import { parse5eMonsterTextBlockOneCall } from './parseOneCall';
import { parse5eMonsterTextBlockSeparateItemsAndStats } from './parseSeparateItemsAndStats';

type MonsterTextBlock5eParsingStrategy = 'ONE_CALL' | 'SEPARATE_ITEMS_AND_STATS';

const parse = async (
  textBlock: string,
  strategy: MonsterTextBlock5eParsingStrategy = 'ONE_CALL',
): Promise<Parsed5eLLMMonster> => {
  switch (strategy) {
    case 'ONE_CALL':
      return parse5eMonsterTextBlockOneCall(textBlock);
    case 'SEPARATE_ITEMS_AND_STATS':
      return parse5eMonsterTextBlockSeparateItemsAndStats(textBlock);
    default:
      throw new Error(`Invalid strategy: ${strategy}`);
  }
};

export default { parse };
