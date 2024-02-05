import { Parsed5eLLMMonster, Parsed5eLLMMonsterSchema } from '../../schemas/parsed-input-data/monster/Parsed5eMonster';

export const parse5eMonsterTextBlockSeparateItemsAndStats = async (text: string): Promise<Parsed5eLLMMonster> => {
  // Item call

  // Stats call

  // TODO
  return Parsed5eLLMMonsterSchema.parse({});
};

export const parseItemNameAndTextList = (text: string) => {
  // TODO
  return [];
};
