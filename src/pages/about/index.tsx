import { useRef } from "react";
import { Button, Space } from 'antd';
import useSelection from '@/hooks/useSelection';

export default function About() {
  const containerRef = useRef<HTMLParagraphElement>(null);

  const { selection, clearSelection } = useSelection(containerRef);

  const doHighlight = () => {
    if (!selection || selection.rangeCount === 0) {
      window.alert('请先选择文本');
      return;
    }
    const highlighting = document.createElement('span');
    highlighting.className = 'bg-yellow-200';
    highlighting.id = Date.now().toString();
    const range = selection.getRangeAt(0);
    const extractedContents = range.extractContents();
    highlighting.appendChild(extractedContents);
    range.insertNode(highlighting);
    clearSelection();
    // range.surroundContents(highlighting);
  }

  const undoHighlight = () => {

  }

  return <div>
    <p ref={containerRef}>
      <span>Hello</span>
      <span>World</span>
    </p>
    <Space>
      <Button onClick={doHighlight}>高亮</Button>
      <Button onClick={undoHighlight}>撤销</Button>
    </Space>
  </div>
}