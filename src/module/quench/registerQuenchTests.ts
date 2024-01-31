/* eslint-disable jest/no-export, jest/expect-expect  */

import registerDummyTest from './dummyTest';
import registerExampleItemTests from './exampleItemTests';

const registerQuenchTests = (quench) => {
  registerDummyTest(quench);
  registerExampleItemTests(quench);
};

export default registerQuenchTests;
