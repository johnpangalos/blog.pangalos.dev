export const GET = async () => {
  const allPostFiles = import.meta.glob<{
    metadata: { date: string };
    path: string;
  }>("../blog/*.md");
  const iterablePostFiles = Object.entries(allPostFiles);

  const allPosts = await Promise.all(
    iterablePostFiles.map(async ([path, resolver]) => {
      const { metadata } = await resolver();
      const postPath = path.slice(2, -".md".length);

      return {
        meta: metadata,
        path: postPath,
      };
    })
  );

  const sortedPosts = allPosts.sort((a, b) => {
    return new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime();
  });

  return {
    body: sortedPosts,
  };
};
