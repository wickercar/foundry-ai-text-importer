/* eslint-disable jest/no-export, jest/expect-expect  */

import { create5eLLMMonsterOutputParser } from '../../monster-parser/text-parsing/parse5eMonsterDataFromText';

const registerFormatInstructionsTests = (quench) => {
  quench.registerBatch('quench.format-instructions', (context) => {
    const { describe, it, assert } = context;

    describe('Testing the format instructions', function () {
      it('Generates an output parser and print the format instructions for examination', async function () {
        const outputParser = create5eLLMMonsterOutputParser();
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore this parameter exists
        const formatInstructions = outputParser.getFormatInstructions({ interpolationDepth: 100 });
        console.log('monster formatInstructions: ', formatInstructions);
        console.log('formatInstructions length: ', formatInstructions.length);
        assert.ok(formatInstructions);
      });
    });
  });
};

export default registerFormatInstructionsTests;
