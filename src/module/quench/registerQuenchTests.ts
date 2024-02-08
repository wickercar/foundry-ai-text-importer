import registerDummyTest from './dummyTest';
import registerExampleItemTests from './exampleItemTests';
import registerFormatInstructionsTests from './formatInstructionsTests';
import registerMonsterCompendiaTests from './monsterCompendiaTests';

const registerQuenchTests = (quench): void => {
  quench.registerBatch('quench.llm-text-content-importer.dummy-test', registerDummyTest, {
    displayName: 'Testing Quench integration',
  });
  quench.registerBatch('quench.llm-text-content-importer.example-item-tests', registerExampleItemTests, {
    displayName: 'Searching Compendia for example items',
  });
  quench.registerBatch('quench.llm-text-content-importer.monster-compendia-tests', registerMonsterCompendiaTests, {
    displayName: 'Testing Monster Compendia Import/Export',
  });
  quench.registerBatch('quench.llm-text-content-importer.format-instructions-tests', registerFormatInstructionsTests, {
    displayName: 'Testing format instructions',
  });
};

export default registerQuenchTests;
