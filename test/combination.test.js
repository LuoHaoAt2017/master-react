import { describe, expect, test, vi } from "vitest";
import { of, repeat, concat, range, timer, map, merge } from "rxjs";
import { fromPromise } from "rxjs/internal/observable/innerFrom";

describe('rxjs 合并操作符', function () {
  test('concat 连接的每个数据源必须都能完结', async () => {
    const source1$ = of(1, 2, 3);
    const source2$ = range(1, 3).pipe(repeat(2));
    let result = [];
    let done = false;
    // 只有获取完source1$的数据才会继续获取source2$的数据，
    // 如果source1$是不会完结的数据源，那么source2$永远不会被提取。
    concat(source1$, source2$).subscribe({
      next: value => result.push(value),
      complete: () => {
        done = true;
      }
    });
    await vi.waitUntil(() => done);
    expect(result).toEqual([1, 2, 3, 1, 2, 3, 1, 2, 3]);
  });

  test('merge 合并异步数据源', async () => {
    // 自动从0开始递增的数字序列是 timer 操作符的默认行为。
    const source1$ = timer(0, 1000).pipe(map(x => x + 'A'));
    const source2$ = timer(500, 1000).pipe(map(x => x + 'B'));
    const result = [];
    const subscription = merge(source1$, source2$).subscribe({
      next: value => result.push(value),
    });
    await vi.waitUntil(() => result.length === 6, {
      timeout: 10000
    });
    subscription.unsubscribe();
    expect(result).toEqual(['0A', '0B', '1A', '1B', '2A', '2B']);
  });

  test('merge 限流', async () => {
    const source1$ = fromPromise(new Promise((resolve) => setTimeout(() => resolve(1), 1000)));
    const source2$ = fromPromise(new Promise((resolve) => setTimeout(() => resolve(2), 2000)));
    const source3$ = fromPromise(new Promise((resolve) => setTimeout(() => resolve(3), 500)));
    let done = false;
    const result = [];
    // 并发处理的限制是2，source3$ 只有等到 source1$ 或者 source2$ 其中任意一个完结之后才会被订阅。
    // source1$ 完结之后，source3$ 被订阅并立即执行，然后是 source2$。
    const subscription = merge(source1$, source2$, source3$, 2).subscribe({
      next: value => result.push(value),
      complete: () => done = true,
    });
    await vi.waitUntil(() => done, {
      timeout: 10000
    });
    subscription.unsubscribe();
    expect(result).toEqual([1, 3, 2]);
  })
});
