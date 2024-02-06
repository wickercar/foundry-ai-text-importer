import { PromptTemplate } from 'langchain/prompts';
import RunTimer from '../../../module/performanceUtils/RunTimer';
import OpenAILLM from '../../llm/openaillm';
import {
  Parsed5eMonsterBasicItemArray,
  Parsed5eMonsterBasicItemArraySchema,
} from '../../schemas/parsed-input-data/monster/Parsed5eMonsterBasicItem';
import { LLMChain } from 'langchain/chains';
import { StructuredOutputParser } from 'langchain/output_parsers';

export const parse5eMonsterTextBlockToBasicItems = async (text: string): Promise<Parsed5eMonsterBasicItemArray> => {
  const llm = OpenAILLM();
  const timer = RunTimer.getInstance();
  console.log(`Starting to parse basic items from text, ${timer.timeElapsed()}s elapsed`);
  const prompt = PromptTemplate.fromTemplate(`
    Parse the provided monster text into an array of the monster's "basic items" as described below
    Be sure to skip all the normal monster stats and just parse the "basic items" (like actions, reactions, etc.). 
    Basic Items come in the later part of the text block.

    TEXT TO PARSE:
    {monsterText}

    SCHEMA AND FORMAT INSTRUCTIONS:
    {formatInstructions}
  `);

  const outputParser = StructuredOutputParser.fromZodSchema(Parsed5eMonsterBasicItemArraySchema);

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

  return output as Parsed5eMonsterBasicItemArray;
};
