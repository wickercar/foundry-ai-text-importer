import { PromptTemplate } from 'langchain/prompts';
import OpenAILLM from '../../llm/openaillm';
import { Parsed5eLLMMonster, Parsed5eLLMMonsterSchema } from '../../schemas/parsed-input-data/monster/Parsed5eMonster';
import { StructuredOutputParser } from 'langchain/output_parsers';
import { LLMChain } from 'langchain/chains';
import RunTimer from '../../../performanceUtils/RunTimer';

export const create5eLLMMonsterOutputParser = (): StructuredOutputParser<typeof Parsed5eLLMMonsterSchema> => {
  return StructuredOutputParser.fromZodSchema(Parsed5eLLMMonsterSchema);
};

export const parseMonsterTextBlockTo5eMonster = async (text: string): Promise<Parsed5eLLMMonster> => {
  const llm = OpenAILLM();
  const timer = RunTimer.getInstance();
  console.log(`Starting to parse monster data from text, ${timer.timeElapsed()}s elapsed`);
  const prompt = PromptTemplate.fromTemplate(`
    Parse the provided monster text into a json schema as specified below.

    TEXT TO PARSE:
    {monsterText}

    SCHEMA AND FORMAT INSTRUCTIONS:
    {formatInstructions}
  `);

  const outputParser = create5eLLMMonsterOutputParser();

  console.log('monster formatInstructions: ', outputParser.getFormatInstructions());

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
