import { parseMonsterTextBlockTo5eMonster } from './parseToBasicMonster';
import { parse5eMonsterTextBlockToBasicInfo } from './parseToBasicInfo';
import { parse5eMonsterTextBlockToBasicItems } from './parseToBasicItems';

export default {
  toBasicMonster: parseMonsterTextBlockTo5eMonster,
  toBasicInfo: parse5eMonsterTextBlockToBasicInfo,
  toBasicItems: parse5eMonsterTextBlockToBasicItems,
};
