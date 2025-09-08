

interface Anchor {
  startXPath: string,
  endXPath: string,
  startOffset: number,
  endOffset: number,
  textContent: string,
  startIsText: boolean,
  endIsText: boolean,
}

interface Comment {
  id: string;
  content: string;
  anchor?: Anchor;
}