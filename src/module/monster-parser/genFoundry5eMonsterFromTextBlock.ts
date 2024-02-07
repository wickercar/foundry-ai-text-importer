import { Foundry5eMonster } from './schemas/foundry/monster/Foundry5eMonster';
import genFoundry5eMonster from './foundry-parsing/Foundry5eMonsterFormatter';
import MonsterTextBlock5eParser from './text-parsing/MonsterTextBlock5eParser/MonsterTextBlock5eParser';
import { Parsed5eLLMMonster } from './schemas/parsed-input-data/monster/Parsed5eMonster';
import Foundry5eItemParser from './foundry-parsing/Foundry5eItemParser/Foundry5eItemParser';
import { Foundry5eItem } from './schemas/foundry/item/Foundry5eItem';
import Foundry5eMonsterFormatter from './foundry-parsing/Foundry5eMonsterFormatter';
import Parsed5eItemParser from './text-parsing/Parsed5eItemParser/Parsed5eItemParser';
import Foundry5eItemFormatter from './foundry-parsing/Foundry5eItemFormatter';
import TaskTracker from '../performanceUtils/TaskTracker';

type MonsterTextBlock5eParsingStrategy =
  | 'ONE_CALL'
  | 'SEPARATE_ITEMS_AND_STATS'
  | 'SMALL_SCHEMA_IN_CHUNKS'
  | 'SMALL_SCHEMA_NO_CHUNKS';

export const genFoundry5eMonsterFromTextBlock = async (
  text: string,
  strategy: MonsterTextBlock5eParsingStrategy = 'SMALL_SCHEMA_NO_CHUNKS',
): Promise<Foundry5eMonster> => {
  let foundry5eMonster: Foundry5eMonster;
  switch (strategy) {
    case 'ONE_CALL':
      foundry5eMonster = await oneCallStrategy(text);
    case 'SEPARATE_ITEMS_AND_STATS':
      foundry5eMonster = await separateItemsAndStatsStrategy(text);
    case 'SMALL_SCHEMA_IN_CHUNKS':
      foundry5eMonster = await parseItemWithParsed5eItemSchemaStrategy(text, true);
    case 'SMALL_SCHEMA_NO_CHUNKS':
      foundry5eMonster = await parseItemWithParsed5eItemSchemaStrategy(text, false);
  }
  console.log('Foundry Monster Generated: ', foundry5eMonster);
  return foundry5eMonster;
};

const oneCallStrategy = async (text: string): Promise<Foundry5eMonster> => {
  const basicMonster: Parsed5eLLMMonster = await MonsterTextBlock5eParser.toBasicMonster(text);
  const foundryItems: Foundry5eItem[] = await Foundry5eItemParser.fromBasicItemList(basicMonster.basicItems);
  return Foundry5eMonsterFormatter.format(basicMonster, foundryItems);
};

const separateItemsAndStatsStrategy = async (text: string): Promise<Foundry5eMonster> => {
  // TODO - try splitting the text first and then parsing the basic info and item names and text fields separately
  const basicInfoPromise = MonsterTextBlock5eParser.toBasicInfo(text).then((basicInfo) => {
    return basicInfo;
  });
  const basicItems = await MonsterTextBlock5eParser.toBasicItems(text);
  const foundryItems = await Foundry5eItemParser.fromBasicItemList(basicItems).then((items) => {
    return items;
  });
  const basicInfo = await basicInfoPromise;
  return Foundry5eMonsterFormatter.format(basicInfo, foundryItems);
};

const parseItemWithParsed5eItemSchemaStrategy = async (text: string, inChunks: boolean): Promise<Foundry5eMonster> => {
  const basicInfoPromise = MonsterTextBlock5eParser.toBasicInfo(text).then((basicInfo) => {
    return basicInfo;
  });
  TaskTracker.startNewTask('Parse Monster Stats', 'Use llm to extract base monster attributes/stats', basicInfoPromise);
  const basicItemsPromise = MonsterTextBlock5eParser.toBasicItems(text);
  TaskTracker.startNewTask(
    'Parse Item Name and Text',
    'Use llm to extract monster items. Items include actions, reactions, special traits, feats, etc.',
    basicItemsPromise,
  );
  const basicItems = await basicItemsPromise;
  const parsedItemsPromise = Parsed5eItemParser.fromBasicItemList(basicItems, inChunks).then((items) => {
    return items;
  });
  const parsedItems = await parsedItemsPromise;
  const foundryItems = parsedItems.map((item) => Foundry5eItemFormatter.format(item));
  console.log('Parsed Foundry Items: ', foundryItems);
  const basicInfo = await basicInfoPromise;
  return Foundry5eMonsterFormatter.format(basicInfo, foundryItems);
};
