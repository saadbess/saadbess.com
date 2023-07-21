/** Returns all blog posts as a collection, excluding drafts. */
const getAllPosts = collection => {
  const projects = collection.getFilteredByGlob('./src/posts/*.md');
  const publishedProjects = projects.filter(item => !item.data.draft);
  return publishedProjects.reverse();
};

module.exports = {
  getAllPosts
};