import { PromptTemplate } from 'langchain/prompts';
import OpenAILLM from '../openaillm';
import { Warf5eLLMMonster, Warf5eLLMMonsterSchema } from '../schemas/parsed-input-data/monster/Warf5eMonster';
import { StructuredOutputParser } from 'langchain/output_parsers';
import { LLMChain } from 'langchain/chains';

export const warfLLM5eMonsterFromText = async (text: string): Promise<Warf5eLLMMonster> => {
  const llm = OpenAILLM();

  const prompt = PromptTemplate.fromTemplate(`
    Parse the provided monster text into a json schema as specified below.

    TEXT TO PARSE:
    {monsterText}

    SCHEMA AND FORMAT INSTRUCTIONS:
    {formatInstructions}
  `);

  const outputParser = StructuredOutputParser.fromZodSchema(Warf5eLLMMonsterSchema);

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

  return output as Warf5eLLMMonster;
};
