import { PromptTemplate } from 'langchain/prompts';
import OpenAILLM from '../../llm/openaillm';
import { Parsed5eItem, Parsed5eItemSchema } from '../../schemas/parsed-input-data/item/Parsed5eItem';
import { StructuredOutputParser } from 'langchain/output_parsers';
import { LLMChain } from 'langchain/chains';
import RunTimer from '../../../module/performanceUtils/RunTimer';
import { Parsed5eMonsterBasicItem } from '../../schemas/parsed-input-data/monster/Parsed5eMonsterBasicItem';

export const genParsed5eItemFromExample = async (
  basicItem: Parsed5eMonsterBasicItem,
  exampleItem: Parsed5eItem,
): Promise<Parsed5eItem> => {
  const llm = OpenAILLM();
  const timer = RunTimer.getInstance();
  console.log(`Starting to generate item ${basicItem.name} from example, ${timer.timeElapsed()}s elapsed`);
  console.log('exampleItem: ', exampleItem);
  const prompt = PromptTemplate.fromTemplate(`
    Parse the provided item text into the json schema specified below. The outputted fields should have the same values as the base item provided unless the itemText suggests a clear difference.

    TEXT TO PARSE:
    {itemName}
    {itemText}

    BASE ITEM:
    {exampleItem}

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
      exampleItem: exampleItem,
    })
  ).text;

  // Remove fields that cause issues
  delete output._id;
  output.effects = [];

  // Passthrough fields
  output.img = exampleItem.img;
  output.flags = exampleItem.flags;
  // TEMP - flag which items are from examples
  output.system.description.value += `\n\n${exampleItem.name} was generated from an example`;

  console.log(`Item ${output.name} generated from example, ${timer.timeElapsed()}s elapsed`);
  console.log('item: ', output);
  return output;
};