
import { Observable } from "rxjs";
import { describe, it, expect } from "vitest";

describe('如何实现操作符', () => {

  it('自定义map操作符', () => {

    function map(project) {
      return new Observable((observer) => {
        const sub = this.subscribe({
          next: value => {
            try {
              return observer.next(project(value));
            } catch (err) {
              observer.error(err);
            }
          },
          error: (err) => observer.error(err),
          complete: () => observer.complete(),
        });
        return {
          // 当map的下游退订，上游的Observable也会接收到退订通知，从⽽可以释放相关资源。
          unsubscribe: () => {
            sub.unsubscribe();
          }
        }
      });
    };
  });
});