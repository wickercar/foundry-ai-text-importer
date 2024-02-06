/* eslint-disable jest/no-export, jest/expect-expect  */

import { create5eLLMMonsterOutputParser } from '../monster-parser/text-parsing/MonsterTextBlock5eParser/parseToBasicMonster';

const registerFormatInstructionsTests = (quench) => {
  quench.registerBatch('quench.format-instructions', (context) => {
    const { describe, it, assert } = context;

    describe('Testing the format instructions', function () {
      it('Generates an output parser for the initial call and prints the format instructions for examination', async function () {
        const outputParser = create5eLLMMonsterOutputParser();
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore this parameter exists
        const formatInstructions = outputParser.getFormatInstructions();
        console.log('monster formatInstructions: ', formatInstructions);
        console.log('formatInstructions length: ', formatInstructions.length);
        assert.ok(formatInstructions);
      });
    });
  });
};

export default registerFormatInstructionsTests;
