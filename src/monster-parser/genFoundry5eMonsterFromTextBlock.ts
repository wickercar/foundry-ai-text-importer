import { Foundry5eMonster } from './schemas/foundry/monster/Foundry5eMonster';
import genFoundry5eMonster from './foundry-parsing/Foundry5eMonsterFormatter';
import RunTimer from '../module/performanceUtils/RunTimer';
import MonsterTextBlock5eParser from './text-parsing/MonsterTextBlock5eParser/MonsterTextBlock5eParser';
import { Parsed5eLLMMonster } from './schemas/parsed-input-data/monster/Parsed5eMonster';
import Foundry5eItemParser from './foundry-parsing/Foundry5eItemParser/Foundry5eItemParser';
import { Foundry5eItem } from './schemas/foundry/item/Foundry5eItem';
import Foundry5eMonsterFormatter from './foundry-parsing/Foundry5eMonsterFormatter';

type MonsterTextBlock5eParsingStrategy = 'ONE_CALL' | 'SEPARATE_ITEMS_AND_STATS';

export const genFoundry5eMonsterFromTextBlock = async (
  text: string,
  strategy: MonsterTextBlock5eParsingStrategy = 'SEPARATE_ITEMS_AND_STATS',
): Promise<Foundry5eMonster> => {
  const timer = RunTimer.getInstance();
  console.log(`Generating monster from text block with strategy ${strategy}, ${timer.timeElapsed()}s elapsed`);
  switch (strategy) {
    case 'ONE_CALL':
      return await oneCallStrategy(text);
    case 'SEPARATE_ITEMS_AND_STATS':
      return await separateItemsAndStatsStrategy(text);
    default:
      throw new Error(`Invalid Text Parsing strateg paramy: ${strategy}`);
  }
};

const oneCallStrategy = async (text: string): Promise<Foundry5eMonster> => {
  const basicMonster: Parsed5eLLMMonster = await MonsterTextBlock5eParser.toBasicMonster(text);
  console.log(`Generated basic monster with basicItems from text block, ${RunTimer.inst().te()}s elapsed`);
  const foundryItems: Foundry5eItem[] = await Foundry5eItemParser.fromBasicItemList(basicMonster.basicItems);
  console.log(`Generated all foundry items, ${RunTimer.inst().te()}s elapsed`);
  return Foundry5eMonsterFormatter.format(basicMonster, foundryItems);
};

const separateItemsAndStatsStrategy = async (text: string): Promise<Foundry5eMonster> => {
  // TODO - try splitting the text first and then parsing the basic info and item names and text fields separately
  const timer = RunTimer.inst();
  const basicInfoPromise = MonsterTextBlock5eParser.toBasicInfo(text).then((basicInfo) => {
    console.log(`Parsed basic info, ${timer.te()}s elapsed`);
    return basicInfo;
  });
  const basicItems = await MonsterTextBlock5eParser.toBasicItems(text);
  const foundryItems = await Foundry5eItemParser.fromBasicItemList(basicItems).then((items) => {
    console.log(`Generated all foundry items, ${timer.te()}s elapsed`);
    return items;
  });
  const basicInfo = await basicInfoPromise;
  console.log('Generated all foundry info and items, formatting', timer.te(), 's elapsed');
  return Foundry5eMonsterFormatter.format(basicInfo, foundryItems);
};
