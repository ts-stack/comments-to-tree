[![Build Status](https://travis-ci.org/KostyaTretyak/comments-to-tree.svg?branch=master)](https://travis-ci.org/KostyaTretyak/comments-to-tree)

# What is this for?

A micro utility that converts a one-dimensional array with comments into a comments tree.

## API

```ts
// We need the comments come from a database with such properties, at least.
interface DefaultCommentFromDb
{
  commentId: number | string;
  parentId?: number | string;
}

// This utility will convert comments from the database to comments with this interface.
interface DefaultComment
{
  commentId: number | string;
  children: this[];
  parentId?: number | string;
  parent?: this;
}
```

This utility has one public method:

```ts
static getTree<T extends DefaultCommentFromDb, U extends DefaultComment>
(
  allCommentsFromDb: T[],
  actionRoot: 'unshift' | 'push',
  actionChild: 'unshift' | 'push'
): U[];
```

Please do not be afraid =). It's easy to use this method.

`CommentsToTree.getTree()` - converts a one-dimensional array of comments into a comments tree. The array must be sorted in reverse order - at its beginning there are the most recent comments.

`allCommentsFromDb` - one-dimensional array of comments from the database (the array sorted in reverse order).

`actionRoot` - the action you need to apply to insert a root comment to comments tree. By default `unshift`.

`actionChild` - the action you need to apply to insert a child comment to comments tree. By default `unshift`.

## Install

```bash
npm install comments-to-tree --save
```

## Usage with TypeScript

First of all, you need to extends the defaults interfaces. After that, you need extends `DefaultCommentsToTree` to override the protected static method `transform()`:

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

const allCommentsFromDb: CommentFromDb[] =
[
  {commentId: 5, parentId: 2, someOtherPropertyFromDb: 'comment5'},
  {commentId: 4, someOtherPropertyFromDb: 'root comment4'},
  {commentId: 3, parentId: 1, someOtherPropertyFromDb: 'comment3'},
  {commentId: 2, parentId: 1, someOtherPropertyFromDb: 'comment2'},
  {commentId: 1, someOtherPropertyFromDb: 'root comment1'},
];

const commentsTree = CommentsToTree.getTree<CommentFromDb, Comment>(allCommentsFromDb);
```

## Usage with JavaScript

Copy and paste code from [index.js](/src/index.js). Then, rewrite the `transform()` function to your needs, after which you can call the `getTree()`:

```js
function getTree(allCommentsFromDb, actionRoot, actionChild)
{
  var actionRoot = actionRoot || 'unshift';
  var actionChild = actionChild || 'unshift';
  var preparedComments = transform(allCommentsFromDb);
  var length = preparedComments.length;
  var commentsTree = [];

  preparedComments.forEach( (comment, index) =>
  {
    if(comment.parentId)
    {
      for(var i = index + 1; i < length; i++)
      {
        var parent = preparedComments[i];

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

function transform(allCommentsFromDb)
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

var allCommentsFromDb =
[
  {commentId: 5, parentId: 2, someOtherPropertyFromDb: 'comment5'},
  {commentId: 4, someOtherPropertyFromDb: 'root comment4'},
  {commentId: 3, parentId: 1, someOtherPropertyFromDb: 'comment3'},
  {commentId: 2, parentId: 1, someOtherPropertyFromDb: 'comment2'},
  {commentId: 1, someOtherPropertyFromDb: 'root comment1'},
];

var commentsTree = getTree(allCommentsFromDb);
```