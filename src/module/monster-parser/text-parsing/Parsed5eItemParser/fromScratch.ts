import { Parsed5eItem, Parsed5eItemSchema } from '../../schemas/parsed-input-data/item/Parsed5eItem';
import { Parsed5eMonsterBasicItem } from '../../schemas/parsed-input-data/monster/Parsed5eMonsterBasicItem';
import { Parsed5eItemChunks } from '../../schemas/parsed-input-data/item/Parsed5eItemChunks';
import askLLM from '../../llm/askLLM';

export const genCustomParsed5eItemFromBasicItem = async (
  basicItem: Parsed5eMonsterBasicItem,
  useChunks = false,
  img: string | undefined = undefined,
): Promise<Parsed5eItem> => {
  // Using "chunks" strategy to generate the item from scratch
  let parsed5eItem;
  // "Chunks" strategy
  if (useChunks) {
    parsed5eItem = await parseInChunks(basicItem, img);
  } else {
    parsed5eItem = await parseInOneCall(basicItem, img);
  }
  console.log('Parsed Custom Item Data: ', parsed5eItem);
  return parsed5eItem;
};

const parseInOneCall = async (
  basicItem: Parsed5eMonsterBasicItem,
  img: string | undefined = undefined,
): Promise<Parsed5eItem> => {
  return askLLM<{ itemName: string; itemText: string }, Parsed5eItem>(
    `Parse the provided item text into the json schema specified below.

    TEXT TO PARSE:
    {itemName}
    {itemText}

    SCHEMA AND FORMAT INSTRUCTIONS:
    {formatInstructions}
  `,
    Parsed5eItemSchema,
    {
      itemName: basicItem.name,
      itemText: basicItem.text,
    },
    {
      overrides: {
        img: img,
        effects: [],
      },
      deletions: ['_id'],
    },
  );
};

const parseInChunks = async (
  basicItem: Parsed5eMonsterBasicItem,
  img: string | undefined = undefined,
): Promise<Parsed5eItem> => {
  // TODO - when you come back, allow non-chunk option

  const chunkResults = await Promise.all(
    Parsed5eItemChunks.map(async (chunk) => {
      try {
        return await askLLM<{ itemName: string; itemText: string }, typeof chunk>(
          `Parse the provided item text into the json schema specified below.
          This is only asking for a subset of the fields in the full item schema, so only fill in the fields that are relevant to the item text provided.

          TEXT TO PARSE:
          {itemName}
          {itemText}`,
          chunk,
          {
            itemName: basicItem.name,
            itemText: basicItem.text,
          },
          {
            overrides: {
              effects: [],
            },
            deletions: ['_id'],
          },
        );
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
