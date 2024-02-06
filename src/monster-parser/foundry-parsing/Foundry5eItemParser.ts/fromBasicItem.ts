import { Foundry5eItem } from '../../schemas/foundry/item/Foundry5eItem';
import FoundryItemCompendia from '../../foundry-compendia/FoundryItemCompendia';
import { Parsed5eMonsterBasicItem } from '../../schemas/parsed-input-data/monster/Parsed5eMonsterBasicItem';
import Foundry5eItemParser from './Foundry5eItemParser';

// this is very rudimentary for now, just generating a blank item with the same name and description, using an existing item as a template if found
export const genFoundry5eItemFromBasicItem = async (basicItem: Parsed5eMonsterBasicItem): Promise<Foundry5eItem> => {
  // TODO - investigate porting over WarfItemToFoundryConverter from server code

  const itemWithSameName = await FoundryItemCompendia.findItemWithName(basicItem.name);
  // Option 1 - try to find an example and use it as inspiration
  if (itemWithSameName != null) {
    return Foundry5eItemParser.fromExample(itemWithSameName, basicItem.name, basicItem.text);
  } else {
    // TODO - super rudimentary for now, just generating a blank item with the same name and description
    return Foundry5eItemParser.fromScratch(basicItem);
  }
  // Option 2 - gen full new item from scratch
};
