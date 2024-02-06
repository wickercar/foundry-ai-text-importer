import { genFoundry5eItemFromBasicItem } from './fromBasicItem';
import { genFoundry5eItemListFromBasicItemList } from './fromBasicItemList';
import { genFoundry5eItemFromExample } from './fromExample';
import { genCustomFoundry5eItemFromBasicItem } from './fromScratch';

export default {
  fromBasicItemList: genFoundry5eItemListFromBasicItemList,
  fromBasicItem: genFoundry5eItemFromBasicItem,
  fromExample: genFoundry5eItemFromExample,
  fromScratch: genCustomFoundry5eItemFromBasicItem,
};
