import { genFoundry5eItemFromBasicItem } from './fromBasicItem';
import { genFoundry5eItemListFromBasicItemList } from './fromBasicItemList';
import { genFoundry5eItemFromExample } from './fromExample';
import { genCustomBoilerplateFoundry5eItemFromBasicItem } from './fromBoilerplate';

export default {
  fromBasicItemList: genFoundry5eItemListFromBasicItemList,
  fromBasicItem: genFoundry5eItemFromBasicItem,
  fromExample: genFoundry5eItemFromExample,
  fromBoilerplate: genCustomBoilerplateFoundry5eItemFromBasicItem,
  fromScratch: genCustomBoilerplateFoundry5eItemFromBasicItem,
};
