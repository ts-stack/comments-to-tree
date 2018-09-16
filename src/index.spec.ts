import { DefaultCommentsToTree, DefaultCommentFromDb, DefaultComment } from './index';


interface CommentFromDb extends DefaultCommentFromDb {
  // Additional property from database.
  someOtherPropertyFromDb: string;
}

interface Comment extends DefaultComment {
  // Additional transformed property.
  someOtherProperty: string;
}

class CommentsToTree extends DefaultCommentsToTree {
  protected static transform(allCommentsFromDb: CommentFromDb[]): Comment[] {
    return allCommentsFromDb.map(commentFromDb => {
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

describe(`CommentsToTree`, () => {
  it(`should not to throw call CommentsToTree.getTree([])`, () => {
    expect(() => CommentsToTree.getTree([])).not.toThrow();
  });

  it(`should create properly structure`, () => {
    const allCommentsFromDb: CommentFromDb[] = [{ commentId: 1, someOtherPropertyFromDb: 'some content' }];
    const expectedArray: Comment[] = [{ commentId: 1, parentId: 0, children: [], someOtherProperty: 'some content' }];
    const actualArray = CommentsToTree.getTree<CommentFromDb, Comment>(allCommentsFromDb);

    expect(JSON.stringify(actualArray)).toEqual(JSON.stringify(expectedArray));
  });

  it(`should create tree comments`, () => {
    const allCommentsFromDb: CommentFromDb[] =
      [
        { commentId: 5, parentId: 2, someOtherPropertyFromDb: 'comment5' },
        { commentId: 4, someOtherPropertyFromDb: 'root comment4' },
        { commentId: 3, parentId: 1, someOtherPropertyFromDb: 'comment3' },
        { commentId: 2, parentId: 1, someOtherPropertyFromDb: 'comment2' },
        { commentId: 1, someOtherPropertyFromDb: 'root comment1' },
      ];

    const result = CommentsToTree.getTree<CommentFromDb, Comment>(allCommentsFromDb, 'unshift', 'unshift');

    expect(result.length).toEqual(2);

    expect(result[0].commentId).toEqual(1);
    const comment1 = result[0];
    expect(comment1.parentId).toEqual(0);
    expect(comment1.children.length).toEqual(2);
    expect(comment1.children[0].commentId).toEqual(2);
    expect(comment1.children[1].commentId).toEqual(3);
    expect(comment1.children[1].parentId).toEqual(1);
    const comment2 = comment1.children[0];
    expect(comment2.parentId).toEqual(1);
    expect(comment2.children.length).toEqual(1);
    expect(comment2.children[0].commentId).toEqual(5);
    expect(comment2.children[0].parentId).toEqual(2);

    expect(result[1].commentId).toEqual(4);
    expect(result[1].parentId).toEqual(0);
    expect(result[1].children.length).toEqual(0);
  });
});
