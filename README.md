# What is this library?

A micro utility that converts a one-dimensional array with comments into a comments tree

```ts
import { DefaultCommentsToTree, DefaultCommentFromDb, DefaultComment } from 'comments-to-tree';


interface CommentFromDb extends DefaultCommentFromDb
{
  // Additional property from database.
  someOtherPropertyFromDb: string;
}

interface Comment extends DefaultComment
{
  // Additional transformed property.
  someOtherProperty: string;
}

class CommentsToTree extends DefaultCommentsToTree
{
  protected static transform(allCommentsFromDb: CommentFromDb[]): Comment[]
  {
    return allCommentsFromDb.map(commentFromDb =>
    {
      return {
        commentId: commentFromDb.commentId,
        parentId: commentFromDb.parentId || 0,
        children: [],
        // Additional property.
        someOtherProperty: commentFromDb.someOtherPropertyFromDb
      };
    });
  }
}
```