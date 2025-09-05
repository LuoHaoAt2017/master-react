import { useRef, useEffect, useState } from 'react';
import { debounce } from 'lodash';
import { getTextAnchor, highlightRange } from './config';
import { content, comments } from './mock';

export default function Home() {
  const containerRef = useRef<any>();
  const [anchorInfo, setAnchorInfo] = useState<Anchor | null>(null);
  const [selectedText, setSelectedText] = useState('');

  useEffect(() => {
    const handleSelection = debounce(() => {
      const sel = window.getSelection();
      if (!sel || !sel.rangeCount) return;

      const range = sel.getRangeAt(0);
      const text = sel.toString().trim();

      // 检查选择是否在指定容器内
      if (containerRef.current && containerRef.current.contains(range.commonAncestorContainer)) {
        setAnchorInfo(getTextAnchor(range));
        highlightRange(range, 'c1', containerRef.current);
        setSelectedText(text);
      } else {
        setAnchorInfo(null);
        setSelectedText('');
      }
    }, 500);

    document.addEventListener('mouseup', handleSelection);
    document.addEventListener('selectionchange', handleSelection);

    return () => {
      document.removeEventListener('mouseup', handleSelection);
      document.removeEventListener('selectionchange', handleSelection);
    };
  }, [containerRef]);

  console.log('anchorInfo: ', anchorInfo);
  console.log('selectedText: ', selectedText);

  return (
    <div className="w-full h-full px-4 flex justify-around">
      <div
        ref={containerRef}
        dangerouslySetInnerHTML={{ __html: content }}
        className='w-3/4 h-full overflow-auto relative'
      />
      <ul className='w-1/4'>
        {
          comments.map(item => <li key={item.id}>{item.content}</li>)
        }
      </ul>
    </div>
  );
}