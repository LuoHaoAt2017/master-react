import { create } from 'zustand';

interface CommentStore {
  visible: boolean;
  setVisible: (visible: boolean) => void,
  comments: Comment[],
  addComment: (comment: Comment) => void,
  setComments: (comments: Comment[]) => void,
}

const useCommentStore = create<CommentStore>((set, get) => ({
  visible: false,
  setVisible: (visible: boolean) => set({ visible }),
  comments: [],
  setComments: (comments: Comment[]) => set({ comments }),
  addComment: (comment: Comment) => {
    const comments = get().comments;
    set({ comments: comments.concat(comment) })
  },
}));

export default useCommentStore;
