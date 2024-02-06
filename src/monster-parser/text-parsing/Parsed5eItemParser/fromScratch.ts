import { PromptTemplate } from 'langchain/prompts';
import RunTimer from '../../../module/performanceUtils/RunTimer';
import OpenAILLM from '../../llm/openaillm';
import { Parsed5eItem, Parsed5eItemSchema } from '../../schemas/parsed-input-data/item/Parsed5eItem';
import { Parsed5eMonsterBasicItem } from '../../schemas/parsed-input-data/monster/Parsed5eMonsterBasicItem';
import { StructuredOutputParser } from 'langchain/output_parsers';
import { Parsed5eItemChunks } from '../../schemas/parsed-input-data/item/Parsed5eItemChunks';
import { LLMChain } from 'langchain/chains';

export const genCustomParsed5eItemFromBasicItem = async (
  basicItem: Parsed5eMonsterBasicItem,
  useChunks = false,
): Promise<Parsed5eItem> => {
  const timer = RunTimer.getInstance();
  console.log(`Generating custom parsed item ${basicItem.name}, ${timer.timeElapsed()}s elapsed`);
  // Using "chunks" strategy to generate the item from scratch
  const llm = OpenAILLM('gpt-4');

  const prompt = PromptTemplate.fromTemplate(`
    Parse the provided item text into the json schema specified below.
    This is only asking for a subset of the fields in the full item schema, so only fill in the fields that are relevant to the item text provided.

    TEXT TO PARSE:
    {itemName}
    {itemText}

    SCHEMA AND FORMAT INSTRUCTIONS:
    {formatInstructions}
  `);

  // TODO - when you come back, allow non-chunk option

  const chunkResults = await Promise.all(
    Parsed5eItemChunks.map(async (chunk) => {
      const outputParser = StructuredOutputParser.fromZodSchema(chunk);

      try {
        const output = (
          await new LLMChain({
            llm,
            prompt,
            outputParser,
          }).invoke({
            formatInstructions: outputParser.getFormatInstructions(),
            itemName: basicItem.name,
            itemText: basicItem.text,
          })
        ).text;

        console.log('chunk input: ', chunk);
        console.log('output from chunk: ', output);
        // Remove fields that cause issues
        delete output._id;
        output.effects = [];
        return output;
      } catch (e) {
        console.error('Error validating chunk: ', e);
        console.log('format Instructions: ', outputParser.getFormatInstructions());
        return {};
      }
    }),
  );

  const item: Parsed5eItem = chunkResults.reduce((acc, chunk) => {
    return { ...acc, ...chunk };
  }, {}) as Parsed5eItem;

  console.log(`Item ${item.name} generated from scratch by chunking, ${timer.timeElapsed()}s elapsed`);
  console.log('item: ', item);

  // "Chunks" strategy

  // TODO - dummy return statement
  return item;
};
