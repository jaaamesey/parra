var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// node_modules/.pnpm/run-with-worker@1.0.4/node_modules/run-with-worker/dist/index.js
var require_dist = __commonJS({
  "node_modules/.pnpm/run-with-worker@1.0.4/node_modules/run-with-worker/dist/index.js"(exports, module) {
    "use strict";
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export = (target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    };
    var __copyProps2 = (to, from, except, desc) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames2(from))
          if (!__hasOwnProp2.call(to, key) && key !== except)
            __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
      }
      return to;
    };
    var __toCommonJS = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
    var __async2 = (__this, __arguments, generator) => {
      return new Promise((resolve, reject) => {
        var fulfilled = (value) => {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        };
        var rejected = (value) => {
          try {
            step(generator.throw(value));
          } catch (e) {
            reject(e);
          }
        };
        var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
        step((generator = generator.apply(__this, __arguments)).next());
      });
    };
    var index_exports = {};
    __export(index_exports, {
      TaskCancellationError: () => TaskCancellationError,
      TaskTimeoutError: () => TaskTimeoutError,
      runWithWorker: () => runWithWorker2
    });
    module.exports = __toCommonJS(index_exports);
    var WORKER_URL = URL.createObjectURL(
      new Blob([
        "onmessage = (m) => (async function(){}).constructor(m.data.funcStr)(m.data.args)"
      ])
    );
    function runWithWorker2(task, deps2, opts) {
      const worker = new Worker(WORKER_URL, opts == null ? void 0 : opts.workerOptions);
      let capturedReject;
      const promise = new Promise(
        (resolve, reject) => __async2(this, null, function* () {
          try {
            capturedReject = reject;
            const awaitedDeps = yield Promise.all(deps2 != null ? deps2 : []);
            const args = awaitedDeps.map((d) => {
              if (typeof (d == null ? void 0 : d._$trustedScriptUrl) === "string") {
                return {
                  $__trustedScript: `import(${JSON.stringify(d._$trustedScriptUrl)})`
                };
              }
              return d;
            });
            const funcStr = `Promise.all(arguments[0].map(d => d && typeof d.$__trustedScript === 'string' ? eval(d.$__trustedScript) : d)).then(deps => (${task.toString()})(...deps)).then(r=>postMessage(r)).catch(e=>postMessage({$__error:e}))`;
            worker.onmessage = (m) => {
              var _a, _b;
              ((_a = m.data) == null ? void 0 : _a.$__error) ? reject((_b = m.data) == null ? void 0 : _b.$__error) : resolve(m.data);
              worker.terminate();
            };
            worker.onerror = (e) => {
              reject(e);
              worker.terminate();
            };
            worker.onmessageerror = (e) => {
              reject(e);
              worker.terminate();
            };
            if ((opts == null ? void 0 : opts.executionTimeoutMs) != null) {
              setTimeout(
                () => reject(
                  new TaskTimeoutError(
                    `Task exceeded ${opts.executionTimeoutMs}ms`
                  )
                ),
                opts.executionTimeoutMs
              );
            }
            worker.postMessage({ funcStr, args });
          } catch (e) {
            reject(e);
          }
        })
      );
      promise.cancel = () => {
        worker.terminate();
        capturedReject == null ? void 0 : capturedReject(new TaskCancellationError("Task cancelled"));
      };
      promise.worker = worker;
      return promise;
    }
    var TaskCancellationError = class extends Error {
    };
    var TaskTimeoutError = class extends Error {
    };
  }
});

// src/index.ts
var import_run_with_worker = __toESM(require_dist());
function parallelMap(threads, arr, mapFn, deps) {
  return __async(this, null, function* () {
    if (!threads) {
      throw new Error("Invalid number of threads: " + threads);
    }
    const results = yield Promise.all(
      splitArr(threads, arr).map(
        (chunk) => (0, import_run_with_worker.runWithWorker)(
          (mapFnStr, chunk, ...deps) => {
            const _mapFn = eval(mapFnStr);
            return chunk.map((item) => _mapFn(item, deps));
          },
          [mapFn.toString(), chunk, ...deps]
        )
      )
    );
    return unsplitArrs(threads, results);
  });
}
function splitArr(split, arr2) {
  var _a;
  let currentSplit = 0;
  const splitArrs = [];
  for (const item of arr2) {
    (_a = splitArrs[currentSplit]) != null ? _a : splitArrs[currentSplit] = [];
    splitArrs[currentSplit].push(item);
    currentSplit = (currentSplit + 1) % split;
  }
  return splitArrs;
}
function unsplitArrs(split, arr2) {
  const unsplit = [];
  for (let i = 0; i < split; i++) {
    for (const chunk2 of arr2) {
      if (i >= chunk2.length) {
        continue;
      }
      unsplit.push(chunk2[i]);
    }
  }
  return unsplit;
}
export {
  parallelMap
};
//# sourceMappingURL=index.mjs.map