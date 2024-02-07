import { PromptTemplate } from 'langchain/prompts';
import OpenAILLM from '../../llm/openaillm';
import { Parsed5eItem, Parsed5eItemSchema } from '../../schemas/parsed-input-data/item/Parsed5eItem';
import { Parsed5eMonsterBasicItem } from '../../schemas/parsed-input-data/monster/Parsed5eMonsterBasicItem';
import { StructuredOutputParser } from 'langchain/output_parsers';
import { Parsed5eItemChunks } from '../../schemas/parsed-input-data/item/Parsed5eItemChunks';
import { LLMChain } from 'langchain/chains';

export const genCustomParsed5eItemFromBasicItem = async (
  basicItem: Parsed5eMonsterBasicItem,
  useChunks = false,
  img: string | undefined = undefined,
): Promise<Parsed5eItem> => {
  // Using "chunks" strategy to generate the item from scratch

  // "Chunks" strategy
  if (useChunks) {
    return parseInChunks(basicItem, img);
  }
  return parseInOneCall(basicItem, img);
};

const parseInOneCall = async (
  basicItem: Parsed5eMonsterBasicItem,
  img: string | undefined = undefined,
): Promise<Parsed5eItem> => {
  const llm = OpenAILLM();

  const prompt = PromptTemplate.fromTemplate(`
    Parse the provided item text into the json schema specified below.

    TEXT TO PARSE:
    {itemName}
    {itemText}

    SCHEMA AND FORMAT INSTRUCTIONS:
    {formatInstructions}
  `);

  const outputParser = StructuredOutputParser.fromZodSchema(Parsed5eItemSchema);

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
  // Remove fields that cause issues
  delete output._id;
  output.effects = [];
  // passthrough fields
  output.img = img;
  return output;
};

const parseInChunks = async (
  basicItem: Parsed5eMonsterBasicItem,
  img: string | undefined = undefined,
): Promise<Parsed5eItem> => {
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
        // Remove fields that cause issues
        delete output._id;
        output.effects = [];
        return output;
      } catch (e) {
        console.error('Error validating chunk: ', e);
        return {};
      }
    }),
  );

  const item: Parsed5eItem = chunkResults.reduce((acc, chunk) => {
    return { ...acc, ...chunk };
  }, {}) as Parsed5eItem;
  item.img = img;
  return item;
};
