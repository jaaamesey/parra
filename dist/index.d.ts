import { runWithWorker } from 'run-with-worker';

/**
 * Parallel version of `Array.map`.
 * This is a wrapper around `runWithWorker` from the "run-with-worker"
 * package, and thus follows the same rules regarding what code is
 * allowed to run inside the computation function, and what is allowed
 * to be passed down in the dependency array.
 */
declare function parallelMap<T, D extends Readonly<Array<unknown>>, R>(
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
mapFn: (item: T, deps: Parameters<Parameters<typeof runWithWorker<unknown, D>>[0]>) => R, 
/**
 * Additional dependencies to provide to `mapFn`, to make up for `mapFn`
 * not being able to make use of its outer scope. Can include dynamic
 * imports, as long as they export `_$trustedScriptUrl = import.meta.url`.
 */
deps: [...D]): Promise<Array<R>>;

export { parallelMap };
