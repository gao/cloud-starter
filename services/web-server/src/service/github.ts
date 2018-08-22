/**
 * Module exposing  the github data APIs. 
 * Currently using the REST / V3 github API. 
 */
import axios from 'axios';
import { Context } from '../context';

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
	const type = 'all';
	const sort = 'pushed';
	const data: any[] = [];
	const per_page = 100;
	let page = 1;
	const pathQuery = `user/repos`;
	while (page < 100) {
		const result = await axios.get(apiUrl + pathQuery, { params: { access_token, type, sort, page, per_page } });
		data.push(...result.data);
		if (result.data.length < 100) {
			break;
		}
		page++;
	}

	return data;
}

export async function getRepo(ctx: Context, repoFullName: string) {
	const username = ctx.username; // TODO: we will need to get the github username (for now the same)
	const access_token = await ctx.getAccessToken();

	const url = apiUrl + `repos/${repoFullName}`;
	const result = await axios.get(url, { params: { access_token } });
	return result.data;
}

export async function getIssues(ctx: Context, repoFullName: string) {
	const username = ctx.username; // TODO: we will need to get the github username (for now the same)
	const access_token = await ctx.getAccessToken();

	const url = apiUrl + `repos/${repoFullName}/issues`;
	const result = await axios.get(url, { params: { access_token } });
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

