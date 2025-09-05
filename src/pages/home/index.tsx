import { useRef, useEffect, useState } from 'react';
import { debounce } from 'lodash';
import { Empty } from 'antd';
import { getPosts } from '@/apis';
import useCommentStore from '@/store/useCommentStore';
import { getTextAnchor, highlightComment } from './config';
import CommentModal from './modal';
import { htmlDoc, mockComments } from './mock';

export default function Home() {
  const comments = useCommentStore(s => s.comments);
  const setComments = useCommentStore(s => s.setComments);
  const visible = useCommentStore(s => s.visible);
  const setVisible = useCommentStore(s => s.setVisible);
  const containerRef = useRef<any>();
  const [anchorInfo, setAnchorInfo] = useState<Anchor>();
  const [selectedText, setSelectedText] = useState('');

  useEffect(() => {
    const current = containerRef.current;
    if (!current) {
      return;
    }
    const handleSelection = debounce(() => {
      const sel = window.getSelection();
      if (!sel || !sel.rangeCount) return;
      const text = sel.toString().trim();
      if (!text.trim()) {
        return;
      }
      setVisible(true);
      const range = sel.getRangeAt(0);
      console.log('range: ', range);
      // 检查选择是否在指定容器内
      if (containerRef.current && containerRef.current.contains(range.commonAncestorContainer)) {
        setAnchorInfo(getTextAnchor(range));
        setSelectedText(text);
        // highlightRange(range, 'c1', containerRef.current);
      } else {
        setAnchorInfo(undefined);
        setSelectedText('');
      }
    }, 500);
    current.addEventListener('mouseup', handleSelection);
    current.addEventListener('selectionchange', handleSelection);
    return () => {
      current.removeEventListener('mouseup', handleSelection);
      current.removeEventListener('selectionchange', handleSelection);
    };
  }, [containerRef, setVisible]);

  useEffect(() => {
    if (containerRef.current) {
      comments.forEach(item => {
        highlightComment(item, containerRef.current);
      });
    }
  }, [containerRef, comments]);

  useEffect(() => {
    if (!visible) {
      setAnchorInfo(undefined);
      setSelectedText('');
    }
  }, [visible]);

  useEffect(() => {
    getPosts().then((resp) => {
      console.log('resp: ', resp);
    }).catch((err) => {
      console.error(err);
    }).finally(() => {
      setComments(mockComments);
    });
  }, [setComments]);

  return (<>
    <CommentModal content={selectedText} anchor={anchorInfo} />
    <div className="w-full h-full flex justify-around">
      <div
        ref={containerRef}
        dangerouslySetInnerHTML={{ __html: htmlDoc }}
        className='w-3/4 h-full overflow-auto relative'
      />
      <ul className='w-1/4 h-full overflow-auto flex flex-col gap-2 px-2 py-4'>
        {
          comments.length ? comments.map(item => <li key={item.id} className='text-sm cursor-pointer' id={item.id}>{item.content}</li>) : <Empty />
        }
      </ul>
    </div>
  </>);
}