import React, { useState, useEffect } from 'react';
import { Observable } from 'rxjs';

function App() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let counter = 1;
    // observer 代理的就是 theObserver，observer.next 执行一次就会调用theObserver 函数一次。
    const theObservable = (observer) => {
      const handler = setInterval(() => {
        observer.next(counter++);
        if (counter > 3) {
          observer.complete();
          clearInterval(handler);
        }
      }, 1000);
    }

    const publisher$ = new Observable(theObservable);

    const theObserver = {
      next: (value) => {
        console.log(value);
      },
      complete: () => {
        console.log('No More Data');
      }
    }

    publisher$.subscribe(theObserver);
  }, []);

  return (
    <>
      <button onClick={() => setCount((count) => count + 1)}>
        count is {count}
      </button>
    </>
  )
}

export default App
