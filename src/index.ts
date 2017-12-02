export interface DefaultCommentFromDb
{
  commentId: number | string;
  parentId?: number | string;
}

export interface DefaultComment
{
  commentId: number | string;
  children: this[];
  parentId?: number | string;
  parent?: this;
}

export type ActionArray = 'unshift' | 'push';

export class DefaultCommentsToTree
{
  /**
   * Converts a one-dimensional array of comments into a comments tree.
   * The array must be sorted in reverse order - at its beginning there are the most recent comments.
   * 
   * @param allCommentsFromDb One-dimensional array of comments from the database (the array sorted in reverse order).
   * @param actionRoot The action you need to apply to insert a root comment.
   * @param actionChild The action you need to apply to insert a child comment.
   */
  static getTree<T extends DefaultCommentFromDb, U extends DefaultComment>
  (
    allCommentsFromDb: T[],
    actionRoot: ActionArray = 'unshift',
    actionChild: ActionArray = 'unshift'
  ): U[]
  {
    const preparedComments: U[] = this.transform(allCommentsFromDb);
    const length = preparedComments.length;
    const commentsTree: U[] = [];

    preparedComments.forEach( (comment, index) =>
    {
      if(comment.parentId)
      {
        for(let i = index + 1; i < length; i++)
        {
          const parent = preparedComments[i];

          if(parent.commentId == comment.parentId)
          {
            parent.children[actionChild](comment);
            comment.parent = parent;
            return;
          }
        }

        console.warn(`For comment with id: %s, not found parent with id: %s`, comment.commentId, comment.parentId);
      }
      else
      {
        commentsTree[actionRoot](comment);
      }      
    });

    return commentsTree;
  }

  /**
   * Transforms comments that came from a database in a one-dimensional array,
   * to comments in a one-dimensional array that have some additional properties.
   */
  protected static transform(allCommentsFromDb: DefaultCommentFromDb[]): any[]
  {
    return allCommentsFromDb.map(commentFromDb =>
    {
      return {
        commentId: commentFromDb.commentId,
        parentId: commentFromDb.parentId || 0,
        children: []
      };
    });
  }
}
