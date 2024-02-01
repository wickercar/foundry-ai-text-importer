/* eslint-disable jest/no-export, jest/expect-expect  */

import registerDummyTest from './dummyTest';
import registerExampleItemTests from './exampleItemTests';
import registerFormatInstructionsTests from './formatInstructionsTests';
import registerMonsterCompendiaTests from './monsterCompendiaTests';

const registerQuenchTests = (quench) => {
  registerDummyTest(quench);
  registerExampleItemTests(quench);
  registerMonsterCompendiaTests(quench);
  registerFormatInstructionsTests(quench);
};

export default registerQuenchTests;
