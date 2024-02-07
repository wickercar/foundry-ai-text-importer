import { StructuredOutputParser } from 'langchain/output_parsers';
import {
  Parsed5eMonsterBasicInfo,
  Parsed5eMonsterBasicInfoSchema,
} from '../../schemas/parsed-input-data/monster/Parsed5eMonster';
import { PromptTemplate } from 'langchain/prompts';
import OpenAILLM from '../../llm/openaillm';
import { LLMChain } from 'langchain/chains';

export const parse5eMonsterTextBlockToBasicInfo = async (text: string): Promise<Parsed5eMonsterBasicInfo> => {
  const llm = OpenAILLM();
  const prompt = PromptTemplate.fromTemplate(`
    Parse the specified parts of the provided monster text into a json schema as specified below.

    TEXT TO PARSE:
    {monsterText}

    SCHEMA AND FORMAT INSTRUCTIONS:
    {formatInstructions}
  `);

  const outputParser = StructuredOutputParser.fromZodSchema(Parsed5eMonsterBasicInfoSchema);

  const output = (
    await new LLMChain({
      llm,
      prompt,
      outputParser,
    }).invoke({
      formatInstructions: outputParser.getFormatInstructions(),
      monsterText: text,
    })
  ).text;

  return output as Parsed5eMonsterBasicInfo;
};
