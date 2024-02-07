import FoundryItemCompendia from '../../foundry-compendia/FoundryItemCompendia';
import { Foundry5eItem } from '../../schemas/foundry/item/Foundry5eItem';
import { notUndefined } from '../../utils';
import Foundry5eItemParser from './Foundry5eItemParser';

export const getFoundryItemFromSpellName = async (spellName: string): Promise<Foundry5eItem | undefined> => {
  return await FoundryItemCompendia.findItemWithName(spellName);
};

export const getFoundryItemListFromSpellNameList = async (spellNames: string[]): Promise<Foundry5eItem[]> => {
  const spellsAndUndefined = await Promise.all(
    spellNames.map((name) => {
      return Foundry5eItemParser.fromSpellName(name);
    }),
  );
  return spellsAndUndefined.filter(notUndefined);
};
