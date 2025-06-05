
export function waitResult(source$) {
  return new Promise(function (resolve, reject) {
    let result = [];
    source$.subscribe({
      next: (value) => result.push(value),
      complete: () => resolve(result),
      error: (err) => reject(err)
    });
  });
}