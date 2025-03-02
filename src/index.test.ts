import { expect, test } from "bun:test";
import { parallelMap, parallelReduce } from "./index";

test("simple parallelMap computation", async () => {
  const res = await parallelMap(
    4,
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    (item, [base]) => base ** item,
    [2],
  );
  expect(res).toEqual([2, 4, 8, 16, 32, 64, 128, 256, 512, 1024]);
});

test("parallelReduce: sum of natural numbers", async () => {
  const res = await parallelReduce(
    4,
    Array.from({ length: 100 }).map((_, i) => i + 1),
    (acc, item) => acc + item,
    0,
    [],
  );
  expect(res).toEqual(5050);
});

test("parallelReduce: product of natural numbers", async () => {
  const res = await parallelReduce(
    4,
    Array.from({ length: 10 }).map((_, i) => i + 1),
    (acc, item) => acc * item,
    1,
    [],
  );
  expect(res).toEqual(3628800);
});
