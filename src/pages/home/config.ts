// 获取元素的XPath
export const getXPathByNode = (element: Node) => {
  if (element.nodeType === Node.TEXT_NODE) {
    // 对于文本节点，返回父元素的XPath并标记为文本节点
    return getElementXPath(element.parentNode as Element) + '/text()';
  }
  if (element.nodeType === Node.ELEMENT_NODE) {
    return getElementXPath(element as Element);
  }
  return '';
};

// 获取元素节点的XPath
export const getElementXPath = (element: Element): string => {
  if (!element || element.nodeType !== Node.ELEMENT_NODE) {
    return '';
  }
  if (element.id) {
    return `//*[@id="${element.id}"]`;
  }
  const paths: string[] = [];
  let currentElement: Element | null = element;
  while (currentElement && currentElement.nodeType === Node.ELEMENT_NODE) {
    let index = 0;
    // 计算在同级元素中的位置
    for (let sibling = currentElement.previousSibling; sibling; sibling = sibling.previousSibling) {
      if (sibling.nodeType === Node.ELEMENT_NODE && sibling.nodeName === currentElement.nodeName) {
        index++;
      }
    }
    const tagName = currentElement.nodeName;
    const pathIndex = index > 0 ? `[${index + 1}]` : '';
    paths.unshift(`${tagName}${pathIndex}`);
    currentElement = currentElement.parentElement;
  }

  return paths.length ? `/${paths.join('/')}` : '';
};

// 通过XPath获取节点的辅助函数
export const getNodeByXPath = (xpath: string) => {
  try {
    return document.evaluate(
      xpath,
      document,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null
    ).singleNodeValue;
  } catch (error) {
    console.error('XPath解析失败:', error);
    return null;
  }
};

// 文本内容搜索备选方案
export const getRangeByContent = (textContent: string) => {
  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    null
  );

  let node;
  while ((node = walker.nextNode())) {
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

// 记录文本位置信息而非修改DOM
export const getAnchorByRange = (range: Range) => {
  const startContainer = range.startContainer;
  const endContainer = range.endContainer;
  const startOffset = range.startOffset;
  const endOffset = range.endOffset;
  // 获取文本节点的XPath和偏移量
  const startXPath = getXPathByNode(startContainer);
  const endXPath = getXPathByNode(endContainer);
  // 记录是否为文本节点
  const startIsText = startContainer.nodeType === Node.TEXT_NODE;
  const endIsText = endContainer.nodeType === Node.TEXT_NODE;
  // 记录文本内容作为备用定位方式
  const textContent = range.toString();
  return {
    startXPath,
    startOffset,
    endXPath,
    endOffset,
    textContent,
    startIsText,
    endIsText,
  } as Anchor;
};

// 根据存储的定位信息找到当前文本位置
export const getRangeByAnchor = (anchor: Anchor) => {
  try {
    let startNode: Node | null = null;
    let endNode: Node | null = null;

    // 解析起始节点
    if (anchor.startIsText) {
      // 如果是文本节点，获取父元素然后选择其文本子节点
      const elementPath = anchor.startXPath.replace(/\/text\(\)$/, '');
      const parentElement = getNodeByXPath(elementPath) as Element;
      if (parentElement) {
        startNode = parentElement.childNodes[0]; // 获取第一个文本节点
      }
    } else {
      startNode = getNodeByXPath(anchor.startXPath);
    }

    // 解析结束节点
    if (anchor.endIsText) {
      const elementPath = anchor.endXPath.replace(/\/text\(\)$/, '');
      const parentElement = getNodeByXPath(elementPath) as Element;
      if (parentElement) {
        endNode = parentElement.childNodes[0]; // 获取第一个文本节点
      }
    } else {
      endNode = getNodeByXPath(anchor.endXPath);
    }

    if (!startNode || !endNode) {
      // fallback: 使用文本内容搜索
      console.error('使用文本内容搜索');
      return getRangeByContent(anchor.textContent);
    }

    const range = document.createRange();
    range.setStart(startNode, anchor.startOffset);
    range.setEnd(endNode, anchor.endOffset);
    return range;
  } catch (error) {
    console.error(error);
    return getRangeByContent(anchor.textContent);
  }
};

// 使用绝对定位的覆盖层显示高亮
export const highlightComment = (comment: Comment, parent: HTMLDivElement) => {
  const commentId = comment.id;
  if (!commentId || !comment.anchor) {
    return;
  }
  const overlay = document.createElement('div');
  overlay.id = `overlay-${commentId}`;
  overlay.className = 'comment-highlight-overlay';
  overlay.dataset.commentId = commentId;
  overlay.style.position = 'fixed';
  overlay.style.left = '0';
  overlay.style.top = '0';
  overlay.style.width = '100%';
  overlay.style.height = '100%';
  overlay.style.pointerEvents = 'none'; // 允许点击穿透到下层文本
  overlay.style.cursor = 'pointer';
  overlay.style.zIndex = '1000';
  overlay.addEventListener("click", function (evt) {
    evt.stopPropagation();
    const target = document.getElementById(commentId);
    if (!target) {
      return;
    }
    target.scrollIntoView({
      behavior: 'smooth'
    });
  });

  // 创建高亮函数，用于初始化和更新位置
  const updateHighlights = () => {
    // 清空现有高亮
    overlay.innerHTML = '';
    if (!comment.anchor) return;
    const range = getRangeByAnchor(comment.anchor);
    if (!range) return;
    const rects = range.getClientRects();
    Array.from(rects).forEach(rect => {
      const highlight = document.createElement('div');
      highlight.style.position = 'absolute';
      highlight.style.left = `${rect.left + window.scrollX}px`; // 加上滚动偏移
      highlight.style.top = `${rect.top + window.scrollY}px`;
      highlight.style.width = `${rect.width}px`;
      highlight.style.height = `${rect.height}px`;
      highlight.style.backgroundColor = 'rgba(255, 235, 59, 0.3)';
      highlight.style.pointerEvents = 'auto'; // 允许点击高亮区域
      overlay.appendChild(highlight);
    });
  };

  // 初始创建高亮
  updateHighlights();

  parent.appendChild(overlay);
};

export const removeHighlights = (comments: Comment[], parent: HTMLDivElement) => {
  if (!parent || comments.length === 0) {
    return;
  }
  comments.forEach(function (comment) {
    const overlay = document.getElementById(`overlay-${comment.id}`);
    if (overlay && parent.contains(overlay)) {
      parent.removeChild(overlay);
    }
  });
}

export const highlightComments = (comments: Comment[], parent: HTMLDivElement) => {
  removeHighlights(comments, parent);
  comments.forEach(item => {
    highlightComment(item, parent);
  });
}