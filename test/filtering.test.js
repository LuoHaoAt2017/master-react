import { describe, expect, test } from "vitest";
import { of, filter, first, take, takeLast, takeWhile, interval, fromEvent, timer, takeUntil } from "rxjs";
import { isEqual } from "lodash";
import { waitResult } from './utils';
import { fromPromise } from "rxjs/internal/observable/innerFrom";

describe('rxjs', function () {
  test('filter', async () => {
    const source$ = of(1, 2, 3, 4, 5, 6).pipe(filter((value) => value % 2 === 0));
    const result = await waitResult(source$);
    expect(isEqual(result, [2, 4, 6])).toBeTruthy();
  });

  test('first', async () => {
    const source$ = of(1, 2, 3, 4, 5, 6).pipe(first((value) => value % 2 === 0));
    const result = await waitResult(source$);
    expect(isEqual(result, [2])).toBeTruthy();
  });

  test('first defaultValue', async () => {
    const source$ = of(1, 2, 3, 4, 5, 6).pipe(first((value) => value > 6, -1));
    const result = await waitResult(source$);
    console.log("result: ", result);
    expect(isEqual(result, [-1])).toBeTruthy();
  });

  test('take 从上有 Observable 拿指定数量的数据', async () => {
    const source$ = interval(100).pipe(take(5));
    const result = await waitResult(source$);
    console.log("result: ", result);
    expect(isEqual(result, [0, 1, 2, 3, 4])).toBeTruthy();
  });

  test('takeLast只有确定上游数据完结的时候才能产⽣数据，⽽且是⼀次性产⽣所有数据', async () => {
    const source$ = interval(100).pipe(take(5)).pipe(takeLast(3));
    const result = await waitResult(source$);
    console.log("result: ", result);
    expect(isEqual(result, [2, 3, 4])).toBeTruthy();
  });

  test('takeWhile会吐出上游数据，直到判定函数返回false', async () => {
    const source$ = interval(100).pipe(take(5)).pipe(takeWhile((value) => value < 3));
    const result = await waitResult(source$);
    console.log("result: ", result);
    expect(isEqual(result, [0, 1, 2])).toBeTruthy();
  });

  test('获取数组中前3个偶数， 获取满足条件的前N个数据', async () => {
    const source$ = interval(100).pipe(take(9));
    const target$ = source$.pipe(filter(value => value % 2 === 0)).pipe(take(3));
    const result$ = await waitResult(target$);
    console.log("result$: ", result$);
    expect(result$).toEqual([0, 2, 4]);
  });

  test('takeUntil 它允许一个 Observable 在另一个 Observable 发出值（称为"通知者"）时自动完成。这在管理订阅和清理资源时特别有用。', async function() {
    const source$ = new Promise(function(resolve) { setTimeout(() => { resolve([1]) }, [200])});
    const cancle$ = timer(300); // 超时控制
    const target$ = fromPromise(source$).pipe(takeUntil(cancle$))
    const result$ = await waitResult(target$);
    expect(result$).toEqual([1]);
  });
});
