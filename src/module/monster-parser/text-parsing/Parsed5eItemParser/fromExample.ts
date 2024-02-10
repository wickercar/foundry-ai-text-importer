import { PromptTemplate } from 'langchain/prompts';
import OpenAILLM from '../../llm/openaillm';
import { Parsed5eItem, Parsed5eItemSchema } from '../../schemas/parsed-input-data/item/Parsed5eItem';
import { StructuredOutputParser } from 'langchain/output_parsers';
import { LLMChain } from 'langchain/chains';
import { Parsed5eMonsterBasicItem } from '../../schemas/parsed-input-data/monster/Parsed5eMonsterBasicItem';
import { string } from 'yargs';
import askLLM from '../../llm/askLLM';

export const genParsed5eItemFromExample = async (
  basicItem: Parsed5eMonsterBasicItem,
  exampleItem: Parsed5eItem,
): Promise<Parsed5eItem> => {
  return askLLM<{ itemName: string; itemText: string; exampleItem: Parsed5eItem }, Parsed5eItem>(
    `Parse the provided item text into the json schema specified below. The outputted fields should have the same values as the base item provided unless the text suggests a clear difference.
    
    TEXT TO PARSE:
    {itemName}
    {itemText}
    `,
    Parsed5eItemSchema,
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
