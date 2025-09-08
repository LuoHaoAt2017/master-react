import { useRef, useEffect, useState } from 'react';
import { debounce } from 'lodash';
import { Empty } from 'antd';
import { getPosts } from '@/apis';
import useCommentStore from '@/store/useCommentStore';
import { getAnchorByRange, highlightComment, removeHighlights } from './config';
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
      if (!sel) return;
      // 点击一个加载完毕的新打开的页面之前，rangeCount 的值是 0。在点击页面之后，rangeCount 的值变为 1，即使并没有可视的选区。
      if (!sel.rangeCount) return;
      // 当选定内容的起点和终点位于内容中的同一位置时，没有选定文本。
      if (sel.isCollapsed) return;
      // 排除空白符
      const text = sel.toString().trim();
      if (!text.trim()) {
        return;
      }
      setVisible(true);
      const range = sel.getRangeAt(0);
      // 检查选择是否在指定容器内
      if (containerRef.current && containerRef.current.contains(range.commonAncestorContainer)) {
        const anchor = getAnchorByRange(range);
        setAnchorInfo(anchor);
        setSelectedText(text);
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
  }, [setVisible]);

  useEffect(() => {
    const parent = containerRef.current;
    const refreshHighlights = () => {
      removeHighlights(comments, containerRef.current);
      comments.forEach(item => {
        highlightComment(item, containerRef.current);
      });
    }
    // 监听滚动和 resize 事件，实时更新位置
    window.addEventListener('resize', refreshHighlights);
    parent.addEventListener('scroll', refreshHighlights);
    parent.addEventListener('resize', refreshHighlights);

    refreshHighlights();
    return () => {
      window.removeEventListener('resize', refreshHighlights);
      parent.removeEventListener('scroll', refreshHighlights);
      parent.removeEventListener('resize', refreshHighlights);
    }
  }, [comments]);

  useEffect(() => {
    if (!visible) {
      setAnchorInfo(undefined);
      setSelectedText('');
    }
  }, [visible]);

  useEffect(() => {
    getPosts().then(() => {
      // console.log('resp: ', resp);
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