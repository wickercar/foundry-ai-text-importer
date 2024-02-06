import { genParsed5eItemFromBasicItem } from './fromBasicItem';
import { genParsed5eItemListFromBasicItemList } from './fromBasicItemList';
import { genCustomParsed5eItemFromBasicItem } from './fromScratch';

export default {
  fromBasicItem: genParsed5eItemFromBasicItem,
  fromBasicItemList: genParsed5eItemListFromBasicItemList,
  fromScratch: genCustomParsed5eItemFromBasicItem,
};
