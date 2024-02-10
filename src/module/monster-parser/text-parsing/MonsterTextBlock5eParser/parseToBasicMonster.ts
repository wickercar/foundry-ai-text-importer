import { PromptTemplate } from 'langchain/prompts';
import OpenAILLM from '../../llm/openaillm';
import { Parsed5eLLMMonster, Parsed5eLLMMonsterSchema } from '../../schemas/parsed-input-data/monster/Parsed5eMonster';
import { StructuredOutputParser } from 'langchain/output_parsers';
import { LLMChain } from 'langchain/chains';
import askLLM from '../../llm/askLLM';

export const parseMonsterTextBlockTo5eMonster = async (text: string): Promise<Parsed5eLLMMonster> => {
  return askLLM<{ monsterText: string }, Parsed5eLLMMonster>(
    `Parse the provided monster text into a json schema as specified below.

    TEXT TO PARSE:
    {monsterText}

    SCHEMA AND FORMAT INSTRUCTIONS:
    {formatInstructions}
  `,
    Parsed5eLLMMonsterSchema,
    {
      monsterText: text,
    },
  );
};
