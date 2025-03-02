import { runWithWorker } from "run-with-worker";

/**
 * Parallel version of `Array.map`.
 * This is a wrapper around `runWithWorker` from the "run-with-worker"
 * package, and thus follows the same rules regarding what code is
 * allowed to run inside the computation function, and what is allowed
 * to be passed down in the dependency array.
 */
export async function parallelMap<T, D extends Readonly<Array<unknown>>, R>(
  /**
   * Number of threads (Web Workers) to run this computation on.
   * Must be above 0.
   */
  threads: number,
  /**
   * Array to perform computation on, which will be distributed amongst threads.
   */
  arr: Readonly<Array<T>>,
  /**
   * The computation to perform on a single item of `arr`.
   */
  mapFn: (
    item: T,
    deps: Parameters<Parameters<typeof runWithWorker<unknown, D>>[0]>,
  ) => R,
  /**
   * Additional dependencies to provide to `mapFn`, to make up for `mapFn`
   * not being able to make use of its outer scope. Can include dynamic
   * imports, as long as they export `_$trustedScriptUrl = import.meta.url`.
   */
  deps: [...D],
): Promise<Array<R>> {
  if (!threads) {
    throw new Error("Invalid number of threads: " + threads);
  }
  // TODO: Get rid of these awful `any`s
  const results: unknown[][] = (await Promise.all(
    splitArr(threads, arr).map((chunk) =>
      runWithWorker(
        ((mapFnStr: any, chunk: any, ...deps: any[]) => {
          const _mapFn: typeof mapFn = eval(mapFnStr);
          return chunk.map((item: any) => _mapFn(item, deps as any));
        }) as unknown as any,
        [mapFn.toString(), chunk, ...deps],
      ),
    ),
  )) as any;
  return unsplitArrs(threads, results) as any;
}

/**
 * Parallel version of `Array.reduce`.
 * This is a wrapper around `runWithWorker` from the "run-with-worker"
 * package, and thus follows the same rules regarding what code is
 * allowed to run inside the computation function, and what is allowed
 * to be passed down in the dependency array.
 */
export async function parallelReduce<T, D extends Readonly<Array<unknown>>>(
  /**
   * Number of threads (Web Workers) to run this computation on.
   * Must be above 0.
   */
  threads: number,
  /**
   * Array to perform computation on, which will be distributed amongst threads.
   */
  arr: Readonly<Array<T>>,
  /**
   * Computation that returns the next running total, based on a current
   * total and the next item in the provided array.
   * Be careful that operations performed here are **commutative**.
   */
  reduceFn: (
    accumulator: T,
    item: T,
    deps: Parameters<Parameters<typeof runWithWorker<unknown, D>>[0]>,
  ) => T,
  /** Value to initialise the `accumulator` of the reduce function to. */
  initialValue: T,
  /**
   * Additional dependencies to provide to `reduceFn`, to make up for `reduceFn`
   * not being able to make use of its outer scope. Can include dynamic
   * imports, as long as they export `_$trustedScriptUrl = import.meta.url`.
   */
  deps: [...D],
): Promise<T> {
  if (!threads) {
    throw new Error("Invalid number of threads: " + threads);
  }
  // TODO: Get rid of these awful `any`s
  const results: unknown[] = (await Promise.all(
    splitArr(threads, arr).map((chunk) =>
      runWithWorker(
        ((reduceFnStr: any, chunk: any, initialValue: any, ...deps: any[]) => {
          const _reduceFn: typeof reduceFn = eval(reduceFnStr);
          return chunk.reduce(
            (acc: any, item: any) => _reduceFn(acc, item, deps as any),
            initialValue,
          );
        }) as unknown as any,
        [reduceFn.toString(), chunk, initialValue, ...deps],
      ),
    ),
  )) as any;
  return runWithWorker(
    ((reduceFnStr: any, chunk: any, initialValue: any, ...deps: any[]) => {
      const _reduceFn: typeof reduceFn = eval(reduceFnStr);
      return chunk.reduce(
        (acc: any, item: any) => _reduceFn(acc, item, deps as any),
        initialValue,
      );
    }) as unknown as any,
    [reduceFn.toString(), results, initialValue, ...deps],
  ) as any;
}

function splitArr<T>(split: number, arr: Readonly<Array<T>>): Array<Array<T>> {
  let currentSplit = 0;
  const splitArrs: Array<Array<T>> = [];
  for (const item of arr) {
    splitArrs[currentSplit] ??= [];
    splitArrs[currentSplit].push(item);
    currentSplit = (currentSplit + 1) % split;
  }
  return splitArrs;
}

function unsplitArrs(
  split: number,
  arr: Readonly<Array<Array<unknown>>>,
): Array<unknown> {
  const unsplit: unknown[] = [];
  for (let i = 0; i < split; i++) {
    for (const chunk of arr) {
      if (i >= chunk.length) {
        continue;
      }
      unsplit.push(chunk[i]);
    }
  }
  return unsplit;
}
