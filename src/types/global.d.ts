

interface Anchor {
  startXPath: string,
  endXPath: string,
  startOffset: number,
  endOffset: number,
  textContent: string,
}

interface Comment {
  id: string;
  content: string;
  anchor?: Anchor;
}