/* eslint-disable jest/expect-expect */
/* eslint-disable jest/no-export */
import foundryItemCompendia from '../../monster-parser/foundry-compendia/foundryItemCompendia';

const registerExampleItemTests = (quench) => {
  quench.registerBatch(
    'quench.llm-text-content-importer.testing-test',
    (context) => {
      const { describe, it, assert } = context;
      describe('Testing the example item search method for timing', function () {
        this.timeout(1000000); // trying this timeout for compendium search, might need to be higher
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
