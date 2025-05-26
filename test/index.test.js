import { describe, it, expect } from "vitest";
import { from, switchMap, Observable } from 'rxjs';

describe('rxjs', function () {
  it('callback hell', () => {

    function funcA(count, cb) {
      if (count > 0) {
        return cb(count + 1);
      }
      return count;
    };

    function funcB(count, cb) {
      if (count > 0) {
        return cb(count + 1);
      }
      return count;
    };

    function funcC(count, cb) {
      if (count > 0) {
        return cb(count + 1);
      }
      return count;
    };

    const result = funcA(1, (count1) => {
      return funcB(count1, (count2) => {
        return funcC(count2, (count3) => {
          return count3;
        });
      });
    });

    expect(result).toBe(4);

  });

  it('pipe 改进', () => {
    function funcA(count, cb) {
      if (count > 0) return cb(count + 1);
      return count;
    }

    function funcB(count, cb) {
      if (count > 0) return cb(count + 1);
      return count;
    }

    function funcC(count, cb) {
      if (count > 0) return cb(count + 1);
      return count;
    }
    // 将回调函数转换为返回 Observable 的形式
    const rxFuncA = (count) => new Promise(resolve => funcA(count, resolve));
    const rxFuncB = (count) => new Promise(resolve => funcB(count, resolve));
    const rxFuncC = (count) => new Promise(resolve => funcC(count, resolve));

    // 使用 switchMap 链式调用
    // from 是 RxJS 中非常重要的创建操作符之一，用于从各种数据源创建 Observable。
    from(rxFuncA(1)).pipe(
      switchMap(count1 => rxFuncB(count1)),
      switchMap(count2 => rxFuncC(count2))
    ).subscribe(result => {
      expect(result).toBe(4);
    });
  });

  it('publisher-observer', () => {
    
    // observer 代理的就是 theObserver，observer.next 执行一次就会调用theObserver 函数一次。
    const theObservable = (observer) => {
      observer.next(1);
      observer.next(2);
      observer.next(3);
    }
    const publisher$ = new Observable(theObservable);

    const theObserver = (value) => {
      console.log(value);
    }

    publisher$.subscribe(theObserver);
  });
});
