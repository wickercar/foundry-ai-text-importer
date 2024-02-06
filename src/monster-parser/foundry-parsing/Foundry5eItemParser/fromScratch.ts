import RunTimer from '../../../module/performanceUtils/RunTimer';
import OpenAILLM from '../../llm/openaillm';
import { Foundry5eItem, Foundry5eItemSchema } from '../../schemas/foundry/item/Foundry5eItem';
import { Parsed5eMonsterBasicItem } from '../../schemas/parsed-input-data/monster/Parsed5eMonsterBasicItem';

export const genCustomFoundry5eItemFromBasicItem = async (
  basicItem: Parsed5eMonsterBasicItem,
): Promise<Foundry5eItem> => {
  const timer = RunTimer.getInstance();
  console.log(`Generating custom foundry item ${name}, ${timer.timeElapsed()}s elapsed`);

  const llm = OpenAILLM('gpt-3.5-turbo');

  const fullItemSchema = Foundry5eItemSchema;

  // TODO - dummy return statement
  return Foundry5eItemSchema.parse({});
};
