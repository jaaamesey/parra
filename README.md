# parra: parallel computations made easy

*Note: This library is still in a very experimental stage of development. Feel free to report any issues [here](https://github.com/jaaamesey/parra/issues).*

This library wraps [run-with-worker](https://github.com/jaaamesey/run-with-worker) with Array functions that enable easy, safe, and platform-agnostic parallel computations in JavaScript Web Workers.

It currently supports:
1. a parallel `Array.map` equivalent
2. a parallel `Array.reduce` equivalent

As with the core run-with-worker package, the amount of overhead Web Workers introduce makes parallelization only useful for computations that would take more than a few milliseconds.

## Examples

```ts
test("parallelMap: powers of 2", async () => {
  const res = await parallelMap(
    4,
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    (item, [base]) => base ** item,
    [2],
  );
  expect(res).toEqual([2, 4, 8, 16, 32, 64, 128, 256, 512, 1024]);
});

test("parallelReduce: sum of numbers", async () => {
  const res = await parallelReduce(
    4,
    Array.from({ length: 100 }).map((_, i) => i + 1),
    (acc, item) => acc + item,
    0,
    [],
  );
  expect(res).toEqual(5050);
});

test("parallelReduce: product of numbers", async () => {
  const res = await parallelReduce(
    4,
    Array.from({ length: 10 }).map((_, i) => i + 1),
    (acc, item) => acc * item,
    1,
    [],
  );
  expect(res).toEqual(3628800);
});
```
