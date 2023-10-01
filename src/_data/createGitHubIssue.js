const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const EleventyFetch = require('@11ty/eleventy-fetch');

module.exports = async function () { // Notice the fetch parameter here
	const postsDirectory = './src/posts';
	const markdownFiles = fs.readdirSync(postsDirectory).filter(file => path.extname(file) === '.md');

	for (let file of markdownFiles) {
		const filePath = path.join(postsDirectory, file);
		const fileContent = fs.readFileSync(filePath, 'utf-8');
		const frontmatter = matter(fileContent);

		if (!frontmatter.data.issueNumber) {
			try {
				const response = await EleventyFetch('/.netlify/functions/createIssue', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						title: frontmatter.data.title,
						description: frontmatter.data.description
					})
				});

				if (response.ok) {
					const data = await response.json();
					frontmatter.data.issueNumber = data.issueNumber;

					const updatedContent = matter.stringify(frontmatter.content, frontmatter.data);
					fs.writeFileSync(filePath, updatedContent);
				} else {
					console.error(`Failed to create issue for post ${frontmatter.data.title}. Status: ${response.status}`);
				}
			} catch (error) {
				console.error(`Error: ${error}`);
			}
		}
	}

	return {};
};
