import { Foundry5eItem } from '../../schemas/foundry/item/Foundry5eItem';
import { Parsed5eMonsterBasicItem } from '../../schemas/parsed-input-data/monster/Parsed5eMonsterBasicItem';
import { Parsed5eSpellcastingItem } from '../../schemas/parsed-input-data/spellcasting/Parsed5eSpellcastingItem';
import Parsed5eSpellcastingItemParser from '../../text-parsing/Parsed5eSpellcastingItemParser';
import { notUndefined } from '../../utils';
import Foundry5eItemParser from './Foundry5eItemParser';

export const getFoundry5eItemsFromBasicSpellcastingItem = async (
  basicItem: Parsed5eMonsterBasicItem,
): Promise<Foundry5eItem[]> => {
  const spellcastingItem: Parsed5eSpellcastingItem = await Parsed5eSpellcastingItemParser.fromText(basicItem.text);
  const foundrySpellItems = await getFoundry5eItemsFromParsed5eSpellcastingItem(spellcastingItem);
  return foundrySpellItems.filter(notUndefined);
};

export const getFoundry5eItemsFromParsed5eSpellcastingItem = async (
  parsedItem: Parsed5eSpellcastingItem,
): Promise<Foundry5eItem[]> => {
  const foundryItems = await Promise.all(
    parsedItem.spells.map(async (basicSpellItem) => {
      return await Foundry5eItemParser.fromSpellName(basicSpellItem.name);
    }),
  );
  return foundryItems.filter(notUndefined);
};
