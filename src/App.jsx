import React, { useEffect, useRef } from 'react';
import { map, fromEvent, merge, debounceTime, tap, filter, bufferTime, switchMap, timer, pairwise, buffer } from 'rxjs';

/**
 * 左键单击 - 执行操作A
 * 右键单击 - 执行操作B
 * 左键双击 - 执行操作C
 * 右键双击 - 执行操作D
 * 在500ms内连续左右键交替点击 - 执行特殊操作E
 * 点击后3秒内没有其他操作 - 执行超时操作F
 */

// 原生 dblclick 事件的间隔时间是系统级别的设定（通常约300-500ms），不可配置。

function App() {
  const btnRef = useRef();
  useEffect(() => {
    const leftClick$ = fromEvent(btnRef.current, 'click').pipe(filter(event => event.button === 0)).pipe(map(() => ({ type: 'left' })));
    const rightClick$ = fromEvent(btnRef.current, 'contextmenu').pipe(tap(event => event.preventDefault())).pipe(map(() => ({ type: 'right' })));
    const allClicks$ = merge(leftClick$, rightClick$);

    // 鼠标左键单击
    leftClick$.pipe(
      buffer(leftClick$.pipe(debounceTime(300))),
      filter(clicks => clicks.length === 1),
    ).subscribe(() => {
      console.log('鼠标左键单击');
    });

    // 鼠标左键双击
    leftClick$.pipe(
      buffer(leftClick$.pipe(debounceTime(300))),
      filter(clicks => clicks.length === 2),
    ).subscribe(() => {
      console.log('鼠标左键双击');
    });

    // 鼠标右键单击
    rightClick$.pipe(
      buffer(rightClick$.pipe(debounceTime(300))),
      filter(clicks => clicks.length === 1)
    ).subscribe(() => {
      console.log('鼠标右键单击');
    });

    // 鼠标右键双击
    rightClick$.pipe(
      buffer(rightClick$.pipe(debounceTime(300))),
      filter(clicks => clicks.length === 2)
    ).subscribe(() => {
      console.log('鼠标右键双击');
    });

    // 鼠标交替点击
    allClicks$.pipe(
      buffer(allClicks$.pipe(debounceTime(300))),
      filter(clicks => clicks.length === 2),
      filter(([first, second]) => first.type !== second.type),
    ).subscribe(() => {
      console.log('鼠标交替点击');
    });

    // 鼠标操作超时
    allClicks$.pipe(
      switchMap(() => timer(3000))
    ).subscribe(() => {
      console.log('鼠标操作超时');
    });
  }, []);

  return (
    <button ref={btnRef}>
      click
    </button>
  )
}

export default App
