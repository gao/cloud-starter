import { get } from './ajax';


export async function getRepos(): Promise<any[]> {
	const result = await get('/api/github/repos');
	return result.data;
}