
import { getKnex } from './da/db';

const privilegesByRoles: { [role: string]: string[] } = {
	'admin': ['um'],
	'user': []
}

export async function getPrivileges(userId: number) {
	const k = await getKnex();
	let q = k('role');
	q.leftJoin('user_role as ur', 'role.id', 'ur.roleId');
	q.where('ur.userId', userId);

	// do the query (need cast here)
	const records = await q.then() as any[];

	const roles = records.map(r => r.name);

	const privileges = [];
	for (const role of roles) {
		const privs = privilegesByRoles[role];
		privileges.push(...privs);
	}

	return privileges;

}