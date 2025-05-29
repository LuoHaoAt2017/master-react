import { describe, it, expect } from "vitest";
import { isEqual } from "lodash";
import { of } from "rxjs";

describe('rxjs', function () {
  it('hello rxjs', async () => {
    const source$ = of(1, 2, 3);
    const list = await new Promise(function(resolve, reject) {
      let result = [];
      source$.subscribe({
        next: (value) => result.push(value),
        complete: () => resolve(result),
        error: (err) => reject(err)
      });
    });
    expect(isEqual(list, [1, 2, 3])).toBeTruthy();
  });
});
