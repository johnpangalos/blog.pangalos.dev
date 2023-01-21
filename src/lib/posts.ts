const imports = import.meta.glob<{
  metadata: { date: string };
  path: string;
  default: {
    render: () => object;
  };
}>("./blog/*.md", { eager: true });

const posts = [];
for (const path in imports) {
  const post = imports[path];
  if (post) {
    posts.push({
      ...post.metadata,
      ...post.default.render(),
      slug: path.replace("./blog/", "").replace(".md", ""),
    });
  }
}

const sortedPosts = posts.sort((a, b) => {
  return new Date(b.date).getTime() - new Date(a.date).getTime();
});

export default sortedPosts;
