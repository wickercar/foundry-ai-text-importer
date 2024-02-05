import OpenAILLM from '../../llm/openaillm';
import { searchMonsterDBForItemWithName } from '../searchFoundryMonsterDB';
import { Foundry5eItem, Foundry5eItemSchema } from '../../schemas/foundry/item/Foundry5eItem';
import { genCustomFoundryItem } from './genCustomFoundry5eItem';
import { genFoundryItemFromExample } from './genFoundry5eItemFromExample';
import FoundryItemCompendia from '../../foundry-compendia/foundryItemCompendia';
import { ActivationType } from '../../schemas/enums/ActivationType';
import { Parsed5eMonsterBasicItem } from '../../schemas/parsed-input-data/monster/Parsed5eMonsterBasicItem';

// this is very rudimentary for now, just generating a blank item with the same name and description, using an existing item as a template if found
export const genFoundryItemFromNameAndText = async (basicItem: Parsed5eMonsterBasicItem): Promise<Foundry5eItem> => {
  // TODO - investigate porting over WarfItemToFoundryConverter from server code

  const itemWithSameName = await FoundryItemCompendia.findItemWithName(basicItem.name);
  // Option 1 - try to find an example and use it as inspiration
  if (itemWithSameName != null) {
    return genFoundryItemFromExample(itemWithSameName, basicItem.name, basicItem.text);
  } else {
    // TODO - super rudimentary for now, just generating a blank item with the same name and description
    return genCustomFoundryItem(basicItem);
  }
  // Option 2 - gen full new item from scratch
};
