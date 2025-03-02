import { expect, it } from "bun:test";
import { parallelMap } from "./index";

it("runs a simple parallel computation", async () => {
  const res = await parallelMap(
    4,
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    (item, [base]) => base ** item,
    [2],
  );
  expect(res).toEqual([2, 4, 8, 16, 32, 64, 128, 256, 512, 1024]);
});
