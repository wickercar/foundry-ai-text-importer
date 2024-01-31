/* eslint-disable jest/no-export, jest/expect-expect  */

import registerDummyTest from './dummyTest';
import registerExampleItemTests from './exampleItemTests';

const registerQuenchTests = (quench) => {
  registerDummyTest(quench);
};

export default registerQuenchTests;
