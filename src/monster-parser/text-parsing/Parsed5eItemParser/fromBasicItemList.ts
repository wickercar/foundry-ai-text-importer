import { Parsed5eItem } from '../../schemas/parsed-input-data/item/Parsed5eItem';
import { Parsed5eMonsterBasicItemArray } from '../../schemas/parsed-input-data/monster/Parsed5eMonsterBasicItem';
import Parsed5eItemParser from './Parsed5eItemParser';

export const genParsed5eItemListFromBasicItemList = async (
  basicItems: Parsed5eMonsterBasicItemArray,
): Promise<Parsed5eItem[]> => {
  return Promise.all(
    basicItems
      // 'about' can come through as an item, filter it out. It is caught by the stats call for now.
      .filter((item) => item.name !== 'about')
      .map(async (basicItem) => {
        const item = await Parsed5eItemParser.fromBasicItem(basicItem);
        return item;
      }),
  );
};
