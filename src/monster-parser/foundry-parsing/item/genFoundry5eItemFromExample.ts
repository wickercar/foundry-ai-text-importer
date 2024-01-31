import { PromptTemplate } from 'langchain/prompts';
import OpenAILLM from '../../openaillm';
import { Foundry5eItem, Foundry5eItemSchema } from '../../schemas/foundry/item/Foundry5eItem';
import { z } from 'zod';
import { StructuredOutputParser } from 'langchain/output_parsers';
import { LLMChain } from 'langchain/chains';

export const genFoundryItemFromExample = async (
  exampleItem: Foundry5eItem,
  name: string,
  text: string,
): Promise<Foundry5eItem> => {
  const llm = OpenAILLM();

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

  // TODO - find a way to keep this in sync with Foundry5eItemSchema
  const systemFieldsToChangeSchema = z.object({
    system: z.object({
      description: z.object({
        value: z
          .string()
          .describe(
            'for example, "<section class="secret"><p><em>Melee Weapon Attack:</em><strong>+4 to hit,</strong>, <strong>5 ft.,</strong> one target. Hit: <strong>5 (1d6 + 2) <em>piercing damage</em></strong>.</p><p></p></section><p>The Gargoyle attacks with its Bite.</p>"',
          ),
      }),
    }),
  });

  const outputParser = StructuredOutputParser.fromZodSchema(Foundry5eItemSchema);

  const output = (
    await new LLMChain({
      llm,
      prompt,
      outputParser,
    }).invoke({
      formatInstructions: outputParser.getFormatInstructions(),
      itemName: name,
      itemText: text,
      exampleItem: exampleItem,
    })
  ).text;

  // Remove fields that cause issues
  delete output._id;

  return output;
};
