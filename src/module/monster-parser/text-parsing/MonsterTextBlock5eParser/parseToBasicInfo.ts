import {
  Parsed5eMonsterBasicInfo,
  Parsed5eMonsterBasicInfoSchema,
} from '../../schemas/parsed-input-data/monster/Parsed5eMonster';
import askLLM from '../../llm/askLLM';

export const parse5eMonsterTextBlockToBasicInfo = async (text: string): Promise<Parsed5eMonsterBasicInfo> => {
  return askLLM<{ monsterText: string }, Parsed5eMonsterBasicInfo>(
    `Parse the specified parts of the provided monster text into a json schema as specified below.

    TEXT TO PARSE:
    {monsterText}

    SCHEMA AND FORMAT INSTRUCTIONS:
    {formatInstructions}
  `,
    Parsed5eMonsterBasicInfoSchema,
    {
      monsterText: text,
    },
  );
};
