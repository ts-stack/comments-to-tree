export interface DefaultCommentFromDb {
  commentId: number | string;
  parentId?: number | string;
}

export interface DefaultComment extends DefaultCommentFromDb {
  children: this[];
  parent?: this;
}

export type Comment<T> = DefaultComment & T;

export type ActionArray = 'unshift' | 'push';

export class CommentsToTree {
  /**
   * Converts a one-dimensional array of comments into a comments tree.
   * The array must be sorted in reverse order - at its beginning there are the most recent comments.
   *
   * @param allCommentsFromDb One-dimensional array of comments from the database (the array sorted in reverse order).
   * @param actionRoot The action you need to apply to insert a root comment to comments tree.
   * @param actionChild The action you need to apply to insert a child comment to comments tree.
   */
  static getTree<T extends DefaultCommentFromDb>(
    allCommentsFromDb: T[],
    actionRoot: ActionArray = 'unshift',
    actionChild: ActionArray = 'unshift'
  ) {
    const length = allCommentsFromDb.length;
    const commentsTree: Comment<T>[] = [];

    allCommentsFromDb.forEach((comment: Comment<T>) => {
      comment.children = comment.children || [];
    });

    allCommentsFromDb.forEach((comment, index) => {
      if (comment.parentId) {
        for (let i = index + 1; i < length; i++) {
          const parent = allCommentsFromDb[i];

          if (parent.commentId == comment.parentId) {
            (parent as any).children[actionChild](comment);
            (comment as any).parent = parent;
            return;
          }
        }

        console.warn(`For comment with id: ${comment.commentId}, not found parent with id: ${comment.parentId}`);
      } else {
        commentsTree[actionRoot](comment as Comment<T>);
      }
    });

    return commentsTree;
  }
}
