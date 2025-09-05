import { useRef, useEffect } from 'react';
import { debounce } from 'lodash';
import { Button } from 'antd';
import { content, comments } from './config';

type Anchor = {
  startXPath: string,
  endXPath: string,
  startOffset: number,
  endOffset: number,
  textContent: string,
}

export default function Index() {
  const containerRef = useRef<any>();
  // const [anchorInfo, setAnchorInfo] = useState<Anchor | null>(null);
  // const [selectedText, setSelectedText] = useState('');

  // 使用绝对定位的覆盖层显示高亮
  const highlightRange = (range: Range, commentId: string) => {
    const rects = range.getClientRects();
    const overlay = document.createElement('div');
    overlay.className = 'comment-highlight-overlay';
    overlay.dataset.commentId = commentId;

    overlay.style.position = 'fixed';
    overlay.style.pointerEvents = 'none';
    overlay.style.zIndex = '1000';
    overlay.style.backgroundColor = 'rgba(255, 235, 59, 0.3)';
    overlay.style.border = '2px solid #ffeb3b';
    overlay.style.borderRadius = '3px';

    // 为每个文本矩形创建高亮区域
    Array.from(rects).forEach(rect => {
      const highlight = document.createElement('div');
      highlight.style.position = 'absolute';
      highlight.style.left = `${rect.left + window.scrollX}px`;
      highlight.style.top = `${rect.top + window.scrollY}px`;
      highlight.style.width = `${rect.width}px`;
      highlight.style.height = `${rect.height}px`;
      highlight.style.border = `1px solid orange`;
      overlay.appendChild(highlight);
    });

    document.body.appendChild(overlay);
    return overlay;
  };

  // 获取元素的XPath
  const getXPath = (element) => {
    // 处理文本节点：先找到其父元素
    if (element.nodeType === Node.TEXT_NODE) {
      element = element.parentNode as Element;
    }
    if (element.nodeType !== Node.ELEMENT_NODE) {
      return '';
    }
    if (element.id) return `//*[@id="${element.id}"]`;

    const paths: string[] = [];
    for (; element && element.nodeType === Node.ELEMENT_NODE; element = element.parentNode) {
      let index = 0;
      for (let sibling = element.previousSibling; sibling; sibling = sibling.previousSibling) {
        if (sibling.nodeType === Node.ELEMENT_NODE && sibling.tagName === element.tagName) {
          index++;
        }
      }

      const tagName = element.tagName;
      const pathIndex = (index ? `[${index + 1}]` : '');
      paths.unshift(`${tagName}${pathIndex}`);
    }

    return paths.length ? `/${paths.join('/')}` : '';
  };

  // 记录文本位置信息而非修改DOM
  const getTextAnchor = (range) => {
    const startContainer = range.startContainer;
    const startOffset = range.startOffset;
    const endContainer = range.endContainer;
    const endOffset = range.endOffset;
    // 获取文本节点的XPath和偏移量
    const startXPath = getXPath(startContainer);
    const endXPath = getXPath(endContainer);

    // 记录文本内容作为备用定位方式
    const textContent = range.toString();

    return {
      startXPath,
      startOffset,
      endXPath,
      endOffset,
      textContent,
    };
  };

  // 文本内容搜索备选方案
  const locateByTextContent = (textContent) => {
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      null
    );

    let node;
    while (node = walker.nextNode()) {
      const index = node.textContent.indexOf(textContent);
      if (index !== -1) {
        const range = document.createRange();
        range.setStart(node, index);
        range.setEnd(node, index + textContent.length);
        return range;
      }
    }
    return null;
  };

  // 根据存储的定位信息找到当前文本位置
  const locateText = (anchor: Anchor) => {
    try {
      const startNode = document.evaluate(
        anchor.startXPath,
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
      ).singleNodeValue;

      const endNode = document.evaluate(
        anchor.endXPath,
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
      ).singleNodeValue;

      if (!startNode || !endNode) {
        //  fallback: 使用文本内容搜索
        return locateByTextContent(anchor.textContent);
      }

      const range = document.createRange();
      range.setStart(startNode, anchor.startOffset);
      range.setEnd(endNode, anchor.endOffset);

      return range;
    } catch (error) {
      return locateByTextContent(anchor.textContent);
    }
  };

  useEffect(() => {
    const handleSelection = debounce(() => {
      const sel = window.getSelection();
      if (!sel || !sel.rangeCount) return;

      const range = sel.getRangeAt(0);
      const text = sel.toString().trim();

      // 检查选择是否在指定容器内
      if (containerRef.current && containerRef.current.contains(range.commonAncestorContainer)) {
        // setAnchorInfo(getTextAnchor(range));
        highlightRange(range, 'c1');
        // setSelectedText(text);
      } else {
        // setAnchorInfo(null);
        // setSelectedText('');
      }
    }, 500);

    document.addEventListener('mouseup', handleSelection);
    document.addEventListener('selectionchange', handleSelection);

    return () => {
      document.removeEventListener('mouseup', handleSelection);
      document.removeEventListener('selectionchange', handleSelection);
    };
  }, [containerRef]);

  return (
    <div className="w-full h-full px-4 flex justify-around">
      <div
        ref={containerRef}
        dangerouslySetInnerHTML={{ __html: content }}
        className='w-fit h-full overflow-auto relative'
      />
      <ul className='w-1/4'>
        {
          comments.map(item => <li key={item.id}>{item.content}</li>)
        }
        <Button className='pointer-events-none'>Add</Button>
      </ul>
    </div>
  );
}