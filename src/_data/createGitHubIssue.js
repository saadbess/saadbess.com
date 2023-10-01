const axios = require("axios");
const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");

module.exports = async function () {
	const postsDirectory = "./src/posts";

	const markdownFiles = fs
		.readdirSync(postsDirectory)
		.filter((file) => path.extname(file) === ".md");

	for (let file of markdownFiles) {
		const filePath = path.join(postsDirectory, file);
		const fileContent = fs.readFileSync(filePath, "utf-8");
		const frontmatter = matter(fileContent);

		// If postId is not in the frontmatter, it means the issue hasn't been created
		if (!frontmatter.data.postId) {
			try {
				const response = await axios.post("/.netlify/functions/createIssue", {
					title: frontmatter.data.title,
					description: frontmatter.data.description,
				});

				if (response.status === 200) {
					frontmatter.data.postId = response.data.postId;

					// Update the markdown file with the new postId
					const updatedContent = matter.stringify(
						frontmatter.content,
						frontmatter.data,
					);
					fs.writeFileSync(filePath, updatedContent);
				} else {
					console.error(
						`Failed to create issue for post ${frontmatter.data.title}`,
					);
				}
			} catch (error) {
				console.error(`Error: ${error}`);
			}
		}
	}

	return {}; // This function doesn't need to return any data to 11ty templates
};
