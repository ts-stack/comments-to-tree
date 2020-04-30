# What is this for?

A micro utility that converts a one-dimensional array with comments into a comments tree.

## API

```ts
// We need the comments come from a database with such properties, at least.
interface DefaultCommentFromDb {
  commentId: number | string;
  parentId?: number | string;
}

// This utility will convert comments from the database to comments with this interface.
interface DefaultComment {
  commentId: number | string;
  children: this[];
  parentId?: number | string;
  parent?: this;
}
```

This utility has one public method:

```ts
static getTree<T extends DefaultCommentFromDb>(
  allCommentsFromDb: T[],
  actionRoot: ActionArray = 'unshift',
  actionChild: ActionArray = 'unshift'
)
```

Please do not be afraid =). It's easy to use this method.

`CommentsToTree.getTree()` - converts a one-dimensional array of comments into a comments tree. The array must be sorted in reverse order - at its beginning there are the most recent comments.

`allCommentsFromDb` - one-dimensional array of comments from the database (the array sorted in reverse order).

`actionRoot` - the action you need to apply to insert a root comment to comments tree. By default `unshift`.

`actionChild` - the action you need to apply to insert a child comment to comments tree. By default `unshift`.

## Install

```bash
npm install @ts-stack/comments-to-tree --save
```

## Usage

You need just implement `DefaultCommentFromDb` in your comment class:

```ts
import { DefaultCommentFromDb } from '@ts-stack/comments-to-tree';

class MyCommentFromDb implements DefaultCommentFromDb {
  commentId: number;
  parentId?: number;
  someOtherPropertyFromDb?: string;
}

const allCommentsFromDb: MyCommentFromDb[] = [
  { commentId: 5, parentId: 2, someOtherPropertyFromDb: 'comment5' },
  { commentId: 4, someOtherPropertyFromDb: 'root comment4' },
  { commentId: 3, parentId: 1, someOtherPropertyFromDb: 'comment3' },
  { commentId: 2, parentId: 1, someOtherPropertyFromDb: 'comment2' },
  { commentId: 1, someOtherPropertyFromDb: 'root comment1' },
];

const commentsTree = CommentsToTree.getTree<MyCommentFromDb>(allCommentsFromDb);
```
