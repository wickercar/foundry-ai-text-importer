import { Foundry5eMonster } from './schemas/foundry/monster/Foundry5eMonster';
import { parse5eMonsterDataFromText } from './text-parsing/parse5eMonsterDataFromText';
import genFoundry5eMonster from './foundry-parsing/genFoundry5eMonster';

export const genFoundry5eMonsterFromTextBlock = async (text: string): Promise<Foundry5eMonster> => {
  const parsedMonsterData = await parse5eMonsterDataFromText(text);
  const foundryMonster = await genFoundry5eMonster(parsedMonsterData);
  return foundryMonster;
};
