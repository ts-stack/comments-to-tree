export interface DefaultCommentFromDb
{
  commentId: number;
  parentId?: number;
}

export interface DefaultComment
{
  commentId: number;
  children: DefaultComment[];
  parentId?: number;
  parent?: DefaultComment;
  [key: string]: any;
}

export type ActionArray = 'unshift' | 'push';

export class DefaultCommentsToTree
{
  /**
   * 
   * @param allCommentsFromDb One-dimensional array of comments from the database.
   * @param actionRoot The action you need to apply to insert a root comment.
   * @param actionChild The action you need to apply to insert a child comment.
   */
  static getTree
  (
    allCommentsFromDb: DefaultCommentFromDb[],
    actionRoot: ActionArray = 'unshift',
    actionChild: ActionArray = 'unshift'
  ): DefaultComment[]
  {
    const preparedComments = this.transform(allCommentsFromDb);
    const commentsTree: DefaultComment[] = [];

    preparedComments.forEach( (comment, index) =>
    {
      if(comment.parentId)
      {
        let parent: DefaultComment;

        for(let i = index + 1; i < preparedComments.length; i++)
        {
          const testComment = preparedComments[i];

          if(testComment.commentId == comment.parentId)
          {
            parent = testComment;
            break;
          }
        }

        if(!parent)
          return console.warn(`For comment with id: %s, not found parent with id: %s`, comment.commentId, comment.parentId);

        comment.parent = parent;
        parent.children[actionChild](comment);
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
  protected static transform(allCommentsFromDb: DefaultCommentFromDb[]): DefaultComment[]
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
