// createGitHubIssue.js
const EleventyFetch = require('@11ty/eleventy-fetch');

const GITHUB_TOKEN = process.env.GITHUB_PERSONAL_ACCESS_TOKEN;
const REPO_OWNER = "saadbess";
const REPO_NAME = "saadbess.com";

async function createGitHubIssue(title, body) {
	const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/issues`;
	const response = await EleventyFetch(url, {
		method: "POST",
		headers: {
			Authorization: `token ${GITHUB_TOKEN}`,
			Accept: "application/vnd.github.v3+json",
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ title, body }),
	});

	const data = await response.json();

	if (response.ok) {
		return data.number;
	} else {
		throw new Error(data.message);
	}
}

module.exports = createGitHubIssue;
