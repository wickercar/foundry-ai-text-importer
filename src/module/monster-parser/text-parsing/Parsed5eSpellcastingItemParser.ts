import { StructuredOutputParser } from 'langchain/output_parsers';
import { PromptTemplate } from 'langchain/prompts';
import { Parsed5eMonsterBasicItem } from '../schemas/parsed-input-data/monster/Parsed5eMonsterBasicItem';
import { LLMChain } from 'langchain/chains';
import OpenAILLM from '../llm/openaillm';
import {
  Parsed5eSpellcastingItem,
  Parsed5eSpellcastingItemSchema,
} from '../schemas/parsed-input-data/spellcasting/Parsed5eSpellcastingItem';

export default class Parsed5eSpellcastingItemParser {
  static fromText = async (text: string): Promise<Parsed5eSpellcastingItem> => {
    const prompt = PromptTemplate.fromTemplate(`
      From the provided text, parse the indicated information about the spells listed
  
      TEXT TO PARSE:
      {spellcastingText}
  
      SCHEMA AND FORMAT INSTRUCTIONS:
      {formatInstructions}
    `);
    // TODO - move somewhere
    const outputParser = StructuredOutputParser.fromZodSchema(Parsed5eSpellcastingItemSchema);

    const llm = OpenAILLM();

    const output = (
      await new LLMChain({
        llm,
        prompt,
        outputParser,
      }).invoke({
        formatInstructions: outputParser.getFormatInstructions(),
        spellcastingText: text,
      })
    ).text;
    console.log('spellcasting output: ', output);
    return output as Parsed5eSpellcastingItem;
  };
}
