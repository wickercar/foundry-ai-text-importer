import { Foundry5eItem } from '../../schemas/foundry/item/Foundry5eItem';
import { Parsed5eMonsterBasicItemArray } from '../../schemas/parsed-input-data/monster/Parsed5eMonsterBasicItem';
import Foundry5eItemParser from './Foundry5eItemParser';

export const genFoundry5eItemListFromBasicItemList = async (
  basicItems: Parsed5eMonsterBasicItemArray,
): Promise<Foundry5eItem[]> => {
  return Promise.all(
    basicItems
      // 'about' can come through as an item, filter it out. It is caught by the stats call for now.
      .filter((item) => item.name !== 'about')
      .map(async (basicItem) => {
        const item = await Foundry5eItemParser.fromBasicItem(basicItem);
        return item;
      }),
  );
};
