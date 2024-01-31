/* eslint-disable @typescript-eslint/ban-ts-comment */

import { Foundry5eItem } from '../schemas/foundry/item/Foundry5eItem';

const findItemWithName = async (name: string): Promise<Foundry5eItem | null> => {
  // TODO - foundry-vtt-types has "type" as called "entity", see if this is fixable with global types or version change
  // @ts-ignore (Type for Metadata is incorrect in foundry-vtt-types)
  const itemPacks = game.packs.filter((p) => p.metadata.type === 'Item');
  for (const pack of itemPacks) {
    const index = await pack.getIndex();
    for (const entry of index) {
      // @ts-ignore (Type for entry is incorrect in foundry-vtt-types - Pick)
      if (entry?.name === name) {
        // @ts-ignore (Type for entry is incorrect in foundry-vtt-types - Pick)
        const item = (await pack.getDocument(entry?._id)) as Item;
        // @ts-ignore (hard casting here)
        return item as Foundry5eItem;
      }
    }
  }
  return null;
};

export default { findItemWithName };