import FoundryItemCompendia from '../../foundry-compendia/FoundryItemCompendia';
import { Parsed5eMonsterBasicItem } from '../../schemas/parsed-input-data/monster/Parsed5eMonsterBasicItem';
import Parsed5eItemParser from './Parsed5eItemParser';
import { Parsed5eItem } from '../../schemas/parsed-input-data/item/Parsed5eItem';

// this is very rudimentary for now, just generating a blank item with the same name and description, using an existing item as a template if found
export const genParsed5eItemFromBasicItem = async (
  basicItem: Parsed5eMonsterBasicItem,
  inChunks: boolean,
): Promise<Parsed5eItem | undefined> => {
  // TODO - the type of the example item should be abstracted out of this method once other example sources are supported
  const exampleFoundryItem = await FoundryItemCompendia.findItemWithName(basicItem.name);
  if (exampleFoundryItem) {
    console.log(`Example Item Provided for ${basicItem.name}: !`, exampleFoundryItem);
  }
  // convert the foundry example to a parsed5eItem (with just formatting)
  // TODO - example items support in this new paradigm (look at Foundry5eItemParser, do that but convert to Parsed5eItem)
  // Option 2 - gen full new item from scratch
  try {
    return Parsed5eItemParser.fromScratch(basicItem, inChunks, exampleFoundryItem?.img);
  } catch (e) {
    console.error(`Failed to parse basic item ${basicItem} from scratch `);
    return undefined;
  }
};
