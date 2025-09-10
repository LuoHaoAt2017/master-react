import { useEffect } from "react";

export default function Index() {
  useEffect(() => {
    const ps = document.querySelectorAll('p');
    const range = new Range();
    // if (range.startContainer === range.endContainer) {
    //   console.log('startContainer 和 endContainer 相等');
    // }
    // if (range.collapsed) {
    //   console.log('range 是折叠的');
    // }
    // range.setStart(ps[1], 0);
    // range.setEnd(ps[2], 0);
    // if (range.collapsed) {
    //   console.log('range 是折叠的');
    // }
    // if (range.commonAncestorContainer === ps[1].parentNode) {
    //   console.log('commonAncestorContainer 是 p 的父节点');
    // }
    range.selectNodeContents(ps[1]);
    console.log(range.commonAncestorContainer === ps[1]);
    const selection = window.getSelection();
    selection?.addRange(range);
  }, []);
  return <div>
    <p>第一段。</p>
    <p>第二段。</p>
    <p>第三段。</p>
    <p>第四段。</p>
  </div>
}