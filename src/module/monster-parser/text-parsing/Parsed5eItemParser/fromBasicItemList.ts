import { Parsed5eItem } from '../../schemas/parsed-input-data/item/Parsed5eItem';
import { Parsed5eMonsterBasicItemArray } from '../../schemas/parsed-input-data/monster/Parsed5eMonsterBasicItem';
import Parsed5eItemParser from './Parsed5eItemParser';
import TaskTracker from '../../../performanceUtils/TaskTracker';
import { notUndefined } from '../../utils';

// Returns an array of Parsed5eItems from an array of Parsed5eMonsterBasicItems
// If any of the items are undefined (failed to parse), they are filtered out silently
export const genParsed5eItemListFromBasicItemList = async (
  basicItems: Parsed5eMonsterBasicItemArray,
  inChunks: boolean,
): Promise<Parsed5eItem[]> => {
  return Promise.all(
    basicItems
      // 'about' can come through as an item, filter it out. It is caught by the stats call for now.
      .filter((item) => item.name !== 'about')
      .map(async (basicItem) => {
        const itemPromise = Parsed5eItemParser.fromBasicItem(basicItem, inChunks);
        TaskTracker.startNewTask(`${basicItem.name} (parse item data)`, ` - ${basicItem.text}`, itemPromise);
        return itemPromise;
      }),
  ).then((items) => {
    return items.filter(notUndefined);
  });
};
