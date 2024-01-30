import OpenAILLM from '../../openaillm';
import { searchMonsterDBForItemWithName } from '../searchFoundryMonsterDB';
import { Foundry5eItem, Foundry5eItemSchema } from '../../schemas/foundry/item/Foundry5eItem';
import { genCustomFoundryItem } from './genCustomFoundry5eItem';
import { genFoundryItemFromExample } from './genFoundry5eItemFromExample';

// this is very rudimentary for now, just generating a blank item with the same name and description, using an existing item as a template if found
export const genFoundryItemFromNameAndText = async (warfItemNameAndText: {
  name: string;
  text: string;
}): Promise<Foundry5eItem> => {
  const { name, text } = warfItemNameAndText;
  // TODO - investigate porting over WarfItemToFoundryConverter from server code

  const itemWithSameName = await searchMonsterDBForItemWithName(warfItemNameAndText.name);
  // Option 1 - try to find an example and use it as inspiration
  if (itemWithSameName != null) {
    return genFoundryItemFromExample(itemWithSameName, name, text);
  } else {
    // TODO - super rudimentary for now, just generating a blank item with the same name and description
    return genCustomFoundryItem(name, text);
  }
  // Option 2 - gen full new item from scratch
};
