/* eslint-disable jest/expect-expect, jest/no-export */
import foundryItemCompendia from '../../monster-parser/foundry-compendia/FoundryItemCompendia';

const registerExampleItemTests = (quench) => {
  quench.registerBatch(
    'quench.llm-text-content-importer.testing-test',
    (context) => {
      const { describe, it, assert } = context;
      // TODO - these are the specific ids from my compendia, won't work on other people's systems. Test against name?
      describe('Testing the example item search method for timing', function () {
        it('Finds BattleAxe in compendium by name', async function () {
          const foundItem = await foundryItemCompendia.findItemWithName('Battleaxe');
          console.log('foundItem', foundItem);
          assert.ok(foundItem?._id === 'mCMaUBMHZ3SpHruA');
        });
        it('Finds Innate Spellcasting in compendium by name', async function () {
          const foundItem = await foundryItemCompendia.findItemWithName('Innate Spellcasting');
          console.log('foundItem', foundItem);
          assert.ok(foundItem?._id === 'hkmTEk6klT6QL4K4');
        });
        it('Finds Magic Missile in compendium by name', async function () {
          const foundItem = await foundryItemCompendia.findItemWithName('Magic Missile');
          console.log('foundItem', foundItem);
          assert.ok(foundItem?._id === 'Els7Q2et8nMYfctO');
        });
        it("Doesn't find (nonexistent) Buttered Toast in compendium by name", async function () {
          const foundItem = await foundryItemCompendia.findItemWithName('Buttered Toast');
          console.log('foundItem', foundItem);
          assert.ok(foundItem == null);
        });
      });
    },
    { displayName: 'Searching Compendia for example items' },
  );
};

export default registerExampleItemTests;
