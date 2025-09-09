import { debounce } from "lodash";
import React, { useEffect, useState } from "react";

let isSelecting = false;

export default function useSelection(el: React.RefObject<HTMLParagraphElement> | null) {
  const [selection, setSelection] = useState<Selection>();

  const clearSelection = () => {
    if (selection) {
      selection.removeAllRanges();
      setSelection(undefined);
    }
  }

  useEffect(() => {
    if (!el || !el.current) {
      return;
    }
    const onSelectStart = () => {
      console.log('开始选择');
      isSelecting = true;
    }
    const onSelectionChange = debounce(() => {
      if (isSelecting) {
        const selection = document.getSelection();
        console.log(selection?.rangeCount);
      }
    }, 500);
    const onSelectFinish = () => {
      console.log('结束选择');
      if (isSelecting) {
        isSelecting = false;
        const selection = document.getSelection();
        if (selection) {
          setSelection(selection);
        } else {
          setSelection(undefined);
        }
      }
    }
    const p = el.current;
    p.addEventListener('selectstart', onSelectStart);
    p.addEventListener('selectionchange', onSelectionChange);
    p.addEventListener('mouseup', onSelectFinish);

    return () => {
      p.removeEventListener('selectstart', onSelectStart);
      p.removeEventListener('selectionchange', onSelectionChange);
      p.removeEventListener('mouseup', onSelectFinish);
    }
  }, [el]);

  return {
    selection,
    clearSelection
  }
}
