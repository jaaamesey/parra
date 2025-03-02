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
