import React, { useState, useEffect, useRef } from 'react';
import { map, fromEvent, merge, debounceTime } from 'rxjs';

/**
 * 左键单击 - 执行操作A
 * 右键单击 - 执行操作B
 * 左键双击 - 执行操作C
 * 在500ms内连续左右键交替点击 - 执行特殊操作D
 * 点击后3秒内没有其他操作 - 执行超时操作E
 */
function App() {
  const btnRef = useRef();
  const [count, setCount] = useState(0);

  useEffect(() => {
    const handleButtonClick = (data) => {
      console.log(data);
      setCount((preCount) => preCount + 1);
    }

    const handleContextMenu = (data) => {
      console.log(data);
    }

    /**
     * 原生 dblclick 事件的间隔时间是系统级别的设定（通常约300-500ms），不可配置。
     * RxJS 可以自由定义什么是"双击"。
     */
    const handleDoubleClick = (data) => {
      console.log(data);
      setCount((preCount) => preCount + 1);
    }

    const leftClick$ = fromEvent(btnRef.current, 'click');
    const rightClick$ = fromEvent(btnRef.current, 'contextmenu');
    const allClicks$ = merge(
      leftClick$.pipe(map(() => ({ type: 'left', data: 'left' }))),
      rightClick$.pipe(map(() => ({ type: 'right', data: 'right' }))),
    ).pipe(debounceTime(500)); // 添加防抖
    const subscription = allClicks$.subscribe(event => {
      switch (event.type) {
        case 'left':
          handleButtonClick(event.data);
          break;
        case 'right':
          handleContextMenu(event.data);
          break;
        case 'double':
          handleDoubleClick(event.data);
          break;
        default:
          break;
      }
    });
    return () => {
      subscription.unsubscribe();
    }
  }, []);

  return (
    <button ref={btnRef}>
      count is {count}
    </button>
  )
}

export default App
