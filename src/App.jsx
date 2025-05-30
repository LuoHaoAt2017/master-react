import React, { useState, useEffect } from 'react';
import { map, Observable, timer } from 'rxjs';

function App() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let counter = 1;
    // observer 代理的就是 theObserver，observer.next 执行一次就会调用theObserver 函数一次。
    const theObservable = (observer) => {
      const handler = setInterval(() => {
        observer.next(counter++);
        if (counter < 0) {
          observer.error(new Error("意外终止"));
        }
        if (counter > 9) {
          clearInterval(handler);
          observer.complete();
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
      },
      error: (err) => {
        console.error(err);
      }
    }

    const subscription = publisher$.pipe(map(x => x * x)).pipe(map(x => x * 2)).subscribe(theObserver);

    setTimeout(() => {
      subscription.unsubscribe();
    }, 5000);
    
    timer(500, 1000).pipe(map(item => item)).subscribe(value => {
      console.log('value: ', value);
    });
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
