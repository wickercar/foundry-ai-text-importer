import { PromptTemplate } from 'langchain/prompts';
import OpenAILLM from '../../llm/openaillm';
import {
  Parsed5eMonsterBasicItemArray,
  Parsed5eMonsterBasicItemArraySchema,
} from '../../schemas/parsed-input-data/monster/Parsed5eMonsterBasicItem';
import { LLMChain } from 'langchain/chains';
import { StructuredOutputParser } from 'langchain/output_parsers';
import askLLM from '../../llm/askLLM';

export const parse5eMonsterTextBlockToBasicItems = async (text: string): Promise<Parsed5eMonsterBasicItemArray> => {
  return askLLM<{ monsterText: string }, Parsed5eMonsterBasicItemArray>(
    `Parse the provided monster text into an array of the monster's "basic items" as described below
    Be sure to skip all the normal monster stats and just parse the "basic items" (like actions, reactions, etc.). 
    Basic Items come in the later part of the text block.

    TEXT TO PARSE:
    {monsterText}

    SCHEMA AND FORMAT INSTRUCTIONS:
    {formatInstructions}
  `,
    Parsed5eMonsterBasicItemArraySchema,
    {
      monsterText: text,
    },
  );
};
