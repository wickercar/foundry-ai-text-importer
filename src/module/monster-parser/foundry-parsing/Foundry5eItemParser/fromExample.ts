import { PromptTemplate } from 'langchain/prompts';
import OpenAILLM from '../../llm/openaillm';
import { Foundry5eItem, Foundry5eItemSchema } from '../../schemas/foundry/item/Foundry5eItem';
import { StructuredOutputParser } from 'langchain/output_parsers';
import { LLMChain } from 'langchain/chains';
import { Parsed5eMonsterBasicItem } from '../../schemas/parsed-input-data/monster/Parsed5eMonsterBasicItem';
import askLLM from '../../llm/askLLM';

export const genFoundry5eItemFromExample = async (
  basicItem: Parsed5eMonsterBasicItem,
  exampleItem: Foundry5eItem,
): Promise<Foundry5eItem> => {
  return askLLM<{ itemName: string; itemText: string; exampleItem: Foundry5eItem }, Foundry5eItem>(
    `Parse the provided item text into the json schema specified below. The outputted fields should have the same values as the base item provided unless the itemText suggests a clear difference.

    TEXT TO PARSE:
    {itemName}
    {itemText}

    BASE ITEM:
    {exampleItem}

    SCHEMA AND FORMAT INSTRUCTIONS:
    {formatInstructions}
    `,
    Foundry5eItemSchema,
    {
      itemName: basicItem.name,
      itemText: basicItem.text,
      exampleItem: exampleItem,
    },
    {
      overrides: {
        img: exampleItem.img,
        flags: exampleItem.flags,
        effects: [],
      },
      deletions: ['_id'],
    },
  );
};
