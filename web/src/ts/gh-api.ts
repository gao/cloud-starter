import { get, post } from './ajax';
import { hub } from 'mvdom';

const dsoHub = hub('dsoHub');

export async function getRepos(): Promise<any[]> {
	const result = await get('/api/github/repos');
	return result.data;
}

export async function importRepo(repo: string): Promise<any> {
	const result = await post('/api/github/import-repo', { repo });
	if (result.success) {
		dsoHub.pub('Project', 'create', result.data);
		return result.data;
	} else {
		throw result.error;
	}
}