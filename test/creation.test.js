import { describe, it, expect } from "vitest";
import { isEqual } from "lodash";
import { map, of, range, lastValueFrom, generate, repeat, Observable } from "rxjs";

describe('rxjs', function () {
  it('of', async () => {
    const source$ = of(1, 2, 3);
    const list = await new Promise(function (resolve, reject) {
      let result = [];
      source$.subscribe({
        next: (value) => result.push(value),
        complete: () => resolve(result),
        error: (err) => reject(err)
      });
    });
    expect(isEqual(list, [1, 2, 3])).toBeTruthy();
  });

  it('range', async () => {
    const source$ = range(1, 3);
    const result = await lastValueFrom(source$.pipe(map(x => x * 2)));
    expect(result).toEqual(6);
  });

  it('generate', async () => {
    const source$ = generate(1, x => x < 100, x => x + 1, x => x * 2);
    const result = await lastValueFrom(source$);
    expect(result).toEqual(198);
  });

  it('repeat', async () => {
    // 为repeat的“重复”功能依赖于上游的完结时机，所以，使⽤repeat很重要的⼀点，就是保证上游Observable对象最终⼀定会完结，不然使⽤repeat就没有意义。
    const source$ = Observable.create((observer) => {
      console.log('subscribe');
      setTimeout(() => { observer.next(1) }, 1000);
      setTimeout(() => { observer.next(2) }, 2000);
      setTimeout(() => { observer.next(3) }, 3000);
      setTimeout(() => { observer.complete() }, 4000);
      return {
        unsubscribe() {
          console.log('unsubscribe');
        }
      }
    });
    const repeat$ = source$.pipe(repeat(2));

    const values = await new Promise((resolve) => {
      let result = [];
      repeat$.subscribe({
        next: value => {
          console.log(value);
          result.push(value);
        },
        complete: () => {
          console.log(result);
          resolve(result);
        }
      });
    });
    expect(values).toEqual([1, 2, 3, 1, 2, 3]);
  }, { timeout: 10000 });

  it('repeat delay', async () => {
    const source$ = of(1, 2, 3);
    const repeat$ = source$.pipe(repeat({
      count: 2,
      delay: 500
    }));
    const result = await new Promise(function(resolve, reject) {
      let res = [];
      repeat$.subscribe({
        next: val => res.push(val),
        error: err => reject(err),
        complete: () => resolve(res)
      });
    });
    expect(result).toEqual([1, 2, 3, 1, 2, 3]);
  }, { timeout: 3000 });
});
