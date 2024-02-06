import { Foundry5eItem } from '../../schemas/foundry/item/Foundry5eItem';
import FoundryItemCompendia from '../../foundry-compendia/FoundryItemCompendia';
import { Parsed5eMonsterBasicItem } from '../../schemas/parsed-input-data/monster/Parsed5eMonsterBasicItem';
import Foundry5eItemParser from './Foundry5eItemParser';

// this is very rudimentary for now, just generating a blank item with the same name and description, using an existing item as a template if found
export const genFoundry5eItemFromBasicItem = async (basicItem: Parsed5eMonsterBasicItem): Promise<Foundry5eItem> => {
  const itemWithSameName = await FoundryItemCompendia.findItemWithName(basicItem.name);
  if (itemWithSameName != null) {
    // Option 1 - try to find an example and use it as inspiration
    return Foundry5eItemParser.fromExample(basicItem, itemWithSameName);
  } else {
    // Option 2 - gen full new item from scratch
    return Foundry5eItemParser.fromScratch(basicItem);
  }
};
