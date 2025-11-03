export type Tag = {
  id: number;
  name: string;
};

export type Post = {
  id: number;
  description: string;
  createdAt: string;
  updatedAt: string;
  UserId: number;
  User: {
    id: number;
    nickName: string;
    email: string;
    createdAt: string;
    updatedAt: string;
  };
  Tags: Tag[];
};

