/* eslint-disable jest/no-export, jest/expect-expect  */

import testRatkingJSON from './testRatkingWarfOutput';

// TODO - quench doesn't work with my foundry version, leaving the code in for the update though
export const registerImportTests = (): void => {
  console.log('register import tests');
  Hooks.on('quenchReady', (quench) => {
    console.log('quench ready');
    quench.registerBatch(
      'quench.llm-text-content-importer.testing-test',
      (context) => {
        const { describe, it, assert } = context;
        describe('Testing Quench', function () {
          it('Passing Test', function () {
            assert.strictEqual(2, 1 + 1);
          });
        });
      },
      { displayName: 'Testing Quench integration' },
    );
    console.log('registered batch');
    quench.runAllBatches();
    console.log('ran all batches');
  });
};
