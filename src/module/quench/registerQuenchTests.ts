/* eslint-disable jest/no-export, jest/expect-expect  */

import registerDummyTest from './dummyTest';
import registerExampleItemTests from './exampleItemTests';
import registerMonsterCompendiaTests from './monsterCompendiaTests';

const registerQuenchTests = (quench) => {
  registerDummyTest(quench);
  registerExampleItemTests(quench);
  registerMonsterCompendiaTests(quench);
};

export default registerQuenchTests;
