export interface DefaultCommentFromDb {
  commentId: number | string;
  parentId?: number | string;
}

export interface DefaultComment {
  commentId: number | string;
  children: this[];
  parentId?: number | string;
  parent?: this;
}

export type ActionArray = 'unshift' | 'push';
