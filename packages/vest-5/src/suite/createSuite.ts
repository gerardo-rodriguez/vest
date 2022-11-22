import { IsolateTypes } from 'IsolateTypes';
import type { CB } from 'vest-utils';

import { SuiteContext } from '../context/SuiteContext';

import { isolate } from 'isolate';
import { SuiteRunResult, suiteRunResult } from 'suiteRunResult';

function createSuite<T extends CB>(
  suiteName: SuiteName,
  suiteCallback: T
): Suite;
function createSuite<T extends CB>(suiteCallback: T): Suite;
function createSuite<T extends CB>(
  ...args: [suiteName: SuiteName, suiteCallback: T] | [suiteCallback: T]
): Suite {
  const [suiteCallback /*suiteName*/] = args.reverse() as [T, SuiteName];

  function suite(): SuiteRunResult {
    let output;
    SuiteContext.run({}, () => {
      isolate(IsolateTypes.SUITE, () => {
        suiteCallback();
        output = suiteRunResult();
      });
    });

    return output as unknown as SuiteRunResult;
  }

  return suite;
}

export type SuiteName = string | void;

export type Suite /*<T extends CB>*/ = (
  ...args: any[]
) => SuiteRunResult; /* & SuiteMethods<T>;*/

// type SuiteMethods<T> = Record<string, T>;

export { createSuite };
