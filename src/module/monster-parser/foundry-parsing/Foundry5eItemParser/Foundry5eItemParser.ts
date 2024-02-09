import { genFoundry5eItemFromBasicItem } from './fromBasicItem';
import { genFoundry5eItemListFromBasicItemList } from './fromBasicItemList';
import { genFoundry5eItemFromExample } from './fromExample';
import { genCustomBoilerplateFoundry5eItemFromBasicItem } from './fromBoilerplate';
import { getFoundryItemFromSpellName, getFoundryItemListFromSpellNameList } from './fromSpellName';
import {
  getFoundry5eItemsFromBasicSpellcastingItem,
  getFoundry5eItemsFromParsed5eSpellcastingItem,
} from './fromBasicSpellcastingItem';

export default {
  fromBasicItemList: genFoundry5eItemListFromBasicItemList,
  fromBasicItem: genFoundry5eItemFromBasicItem,
  fromExample: genFoundry5eItemFromExample,
  fromBoilerplate: genCustomBoilerplateFoundry5eItemFromBasicItem,
  fromScratch: genCustomBoilerplateFoundry5eItemFromBasicItem,
  fromSpellName: getFoundryItemFromSpellName,
  fromSpellNameList: getFoundryItemListFromSpellNameList,
  fromBasicSpellcastingItem: getFoundry5eItemsFromBasicSpellcastingItem,
  fromParsedSpellcastingItem: getFoundry5eItemsFromParsed5eSpellcastingItem,
};
