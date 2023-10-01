const axios = require("axios");

exports.handler = async (event, context) => {
	console.log("function is being called here >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
	if (event.httpMethod !== "POST") {
		return { statusCode: 405, body: "Method Not Allowed" };
	}

	const { title, description } = JSON.parse(event.body);

	const GITHUB_TOKEN = process.env.GITHUB_PERSONAL_ACCESS_TOKEN;
	const REPO_OWNER = "saadbess";
	const REPO_NAME = "saadbess.com";
	const headers = {
		Authorization: `token ${GITHUB_TOKEN}`,
		"User-Agent": "Netlify-11ty-GitHub-Issue-Creator",
		Accept: "application/vnd.github.v3+json",
	};

	try {
		const response = await axios.post(
			`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/issues`,
			{
				title: `Post Issue: ${title}`,
				body: description,
				labels: ["11ty-post"],
			},
			{ headers },
		);

		if (response.status === 201) {
			return {
				statusCode: 200,
				body: JSON.stringify({ issueNumber: response.data.number }),
			};
		} else {
			return {
				statusCode: 400,
				body: `Failed to create issue: ${response.statusText}`,
			};
		}
	} catch (error) {
		return { statusCode: 500, body: error.toString() };
	}
};
