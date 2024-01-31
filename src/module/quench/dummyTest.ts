/* eslint-disable jest/no-export */
const registerDummyTest = (quench) => {
  quench.registerBatch(
    'quench.llm-text-content-importer.testing-test',
    (context) => {
      const { describe, it, assert } = context;
      describe('Testing quench with 1+1 = 2', function () {
        it('Passing Test', function () {
          assert.strictEqual(2, 1 + 1);
        });
      });
    },
    { displayName: 'Testing Quench integration' },
  );
};

export default registerDummyTest;
