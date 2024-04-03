type TypeMetadata = {
  id: string;
  title: string;
  slug?: string;
  description?: string;
  date: string;
  tags: string[];
};

type TypeBlogPost = {
  meta: TypeMetadata;
  content: ReactElement<any, string | JSXElementConstructor<any>>;
};

type FileTree = {
  tree: [{ path: string }];
};

type TypeListItemProps = {
  post: TypeMeta;
};

type TypeGenerateMetadataProps = {
  params: {
    postId: string;
  };
};

type TypeDynamicTagProps = {
  params: {
    tag: string;
  };
};
