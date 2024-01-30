import { PromptTemplate } from 'langchain/prompts';
import OpenAILLM from '../openaillm';
import { Parsed5eLLMMonster, Parsed5eLLMMonsterSchema } from '../schemas/parsed-input-data/monster/Parsed5eMonster';
import { StructuredOutputParser } from 'langchain/output_parsers';
import { LLMChain } from 'langchain/chains';

export const parse5eMonsterDataFromText = async (text: string): Promise<Parsed5eLLMMonster> => {
  const llm = OpenAILLM();

  const prompt = PromptTemplate.fromTemplate(`
    Parse the provided monster text into a json schema as specified below.

    TEXT TO PARSE:
    {monsterText}

    SCHEMA AND FORMAT INSTRUCTIONS:
    {formatInstructions}
  `);

  const outputParser = StructuredOutputParser.fromZodSchema(Parsed5eLLMMonsterSchema);

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

  console.log('unparsed output | ', output);

  return output as Parsed5eLLMMonster;
};
