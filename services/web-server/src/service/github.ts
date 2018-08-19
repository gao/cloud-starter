


import { srouter } from '../express-utils';
import axios from 'axios';
import { userDao, oauthDao } from '../da/daos';
import { newContext, Context } from '../context';
import { setAuth } from '../auth';

const _router = srouter();

const client_id = 'd4731366d9ef5840db33';
const client_secret = '018d748a41d2e9cf76d554b2bc8da8dc904419de';
const apiUrl = 'https://api.github.com/';



export async function getUserInfo(access_token: string) {
	const result = await axios.get(apiUrl + 'user', { params: { access_token } });
	return result.data;
}

export async function getUserRepos(ctx: Context) {
	const username = ctx.username; // TODO: we will need to get the github username (for now the same)
	const access_token = await ctx.getAccessToken();

	const result = await axios.get(apiUrl + `users/${username}/repos`, { params: { access_token } });
	return result.data;
}


/** Get access token */
export async function getAccessToken(code: string) {
	const url = `https://github.com/login/oauth/access_token`;
	const result = await axios.post(url, { client_id, client_secret, code },
		{ headers: { accept: 'application/json' } });

	const data = result.data;

	if (data.error) {
		throw data;
	}

	return data.access_token as string;
}

