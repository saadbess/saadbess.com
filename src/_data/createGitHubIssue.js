const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const axios = require('axios');

module.exports = async function () {
	const postsDirectory = './src/posts';
	const markdownFiles = fs.readdirSync(postsDirectory).filter(file => path.extname(file) === '.md');

	// Step 1: Get the highest existing postId
	let highestPostId = 0;
	for (let file of markdownFiles) {
		const filePath = path.join(postsDirectory, file);
		const fileContent = fs.readFileSync(filePath, 'utf-8');
		const frontmatter = matter(fileContent);
		if (frontmatter.data.postId && frontmatter.data.postId > highestPostId) {
			highestPostId = frontmatter.data.postId;
		}
	}

	// Step 2: Process each markdown file
	for (let file of markdownFiles) {
		const filePath = path.join(postsDirectory, file);
		const fileContent = fs.readFileSync(filePath, 'utf-8');
		const frontmatter = matter(fileContent);

		// If postId is missing, assign the next available one
		if (!frontmatter.data.postId) {
			highestPostId += 1;
			frontmatter.data.postId = highestPostId;
			const updatedContent = matter.stringify(frontmatter.content, frontmatter.data);
			fs.writeFileSync(filePath, updatedContent);
		}

		// For every postId, call the Netlify function to ensure a corresponding GitHub issue
		try {
			const response = await axios.post('http://localhost:8888/.netlify/functions/createIssue', {
				postId: frontmatter.data.postId,
				title: frontmatter.data.title,
				description: frontmatter.data.description
			});

			if (response.status !== 200) {
				console.error(`Failed to create/verify issue for post ${frontmatter.data.title}. Status: ${response.status}`);
			}
		} catch (error) {
			console.error(`Error processing file ${file}: ${error.message}`);
		}
	}
	return {};
};
