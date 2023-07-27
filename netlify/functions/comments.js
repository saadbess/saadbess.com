const { Octokit } = require('@octokit/rest');
const { createTokenAuth } = require('@octokit/auth-token');
const sanitizeHtml = require('sanitize-html');
const dayjs = require('dayjs');
const relativeTime = require('dayjs/plugin/relativeTime');

dayjs.extend(relativeTime);

// Encapsulating the token generation into its own function
async function getToken() {
	const auth = createTokenAuth(process.env.GITHUB_PERSONAL_ACCESS_TOKEN);
	const { token } = await auth();
	return token;
}

// Encapsulating the rate limit check into its own function
async function checkRateLimit(octokitClient) {
	const { data: rateLimitInfo } = await octokitClient.rateLimit.get();
	return rateLimitInfo.resources.core.remaining;
}

// Encapsulating the comments fetching and formatting into its own function
async function fetchAndFormatComments(octokitClient, issueNumber) {
	const response = await octokitClient.issues.listComments({
		owner: 'saadbess',
		repo: 'saadbess.com',
		issue_number: issueNumber,
	});

	return response.data
		.sort((a, b) => a.created_at.localeCompare(b.created_at))
		.map(comment => ({
			user: {
				avatarUrl: comment.user.avatar_url,
				name: sanitizeHtml(comment.user.login),
			},
			datePosted: dayjs(comment.created_at).fromNow(),
			isEdited: comment.created_at !== comment.updated_at,
			isAuthor: comment.author_association === 'OWNER',
			body: sanitizeHtml(comment.body),
		}));
}

exports.handler = async (event) => {
	const issueNumber = event.queryStringParameters.id;

	try {
		const token = await getToken();
		const octokitClient = new Octokit({ auth: token });

		if (await checkRateLimit(octokitClient) === 0) {
			return {
				statusCode: 429,
				body: JSON.stringify({ error: 'API rate limit reached. Check back later.' }),
			};
		}

		const comments = await fetchAndFormatComments(octokitClient, issueNumber);
		return {
			statusCode: 200,
			body: JSON.stringify({ data: comments }),
		};

	} catch (error) {
		console.error(error);
		return {
			statusCode: 500,
			body: JSON.stringify({ error: 'Unable to fetch comments for this post.' }),
		};
	}
};