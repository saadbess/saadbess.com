module.exports = function (eleventyConfig) {
	eleventyConfig.addCollection("relatedPosts", function (collection) {
		return collection.getAll().filter(item => !item.data.draft).map(post => {
			let related = [];

			if (post.data.tags) {
				post.data.tags.forEach(tag => {
					collection.getFilteredByTag(tag).forEach(item => {
						if (item.url !== post.url && !related.includes(item) && !item.data.draft) {
							related.push(item);
						}
					});
				});
			}

			// Remove duplicates and limit to a specific number of related posts, for instance, 2
			related = [...new Set(related)].slice(0, 2);

			post.data.related = related;

			return post;
		});
	});
};
