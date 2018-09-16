/**
 * Converts a one-dimensional array of comments into a comments tree.
 * The array must be sorted in reverse order - at its beginning there are the most recent comments.
 * 
 * @param allCommentsFromDb One-dimensional array of comments from the database (the array sorted in reverse order).
 * @param actionRoot The action you need to apply to insert a root comment to comments tree. Accepted values `unshift` or` push`.
 * @param actionChild The action you need to apply to insert a child comment to comments tree. Accepted values `unshift` or` push`.
 */
function getTree(allCommentsFromDb, actionRoot, actionChild) {
  actionRoot = actionRoot || 'unshift';
  actionChild = actionChild || 'unshift';
  var preparedComments = transform(allCommentsFromDb);
  var length = preparedComments.length;
  var commentsTree = [];

  preparedComments.forEach(function (comment, index) {
    if (comment.parentId) {
      for (var i = index + 1; i < length; i++) {
        var parent = preparedComments[i];

        if (parent.commentId == comment.parentId) {
          parent.children[actionChild](comment);
          comment.parent = parent;
          return;
        }
      }
      console.warn(`For comment with id: %s, not found parent with id: %s`, comment.commentId, comment.parentId);
    } else {
      commentsTree[actionRoot](comment);
    }
  });

  return commentsTree;
}

/**
 * Transforms comments that came from a database in a one-dimensional array,
 * to comments in a one-dimensional array that have some additional properties.
 * 
 * @param allCommentsFromDb One-dimensional array of comments from the database (the array sorted in reverse order).
 */
function transform(allCommentsFromDb) {
  return allCommentsFromDb.map(function (commentFromDb) {
    return {
      commentId: commentFromDb.commentId,
      parentId: commentFromDb.parentId || 0,
      children: []
    };
  });
}
