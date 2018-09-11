
import { getKnex } from './da/db';


const viewer = ['project-read', 'ticket-read'];
const member = [...viewer, 'ticket-write', 'label-assign']; // all viewer privileges, plus ticket writer and label creator
const manager = [...member, 'label-create'];
const owner = [...manager, 'project-write'];

const privilegesByProjectRoles: { [role: string]: string[] } = {
	viewer,
	member,
	manager,
	owner
};


// NOTE: here we do not use the daos scheme to get the role as it will add cyclic issues and it is not needed. 
export async function getProjectPrivileges(userId: number, projectId: number) {
	const k = await getKnex();
	let q = k('role');

	q.where({ userId, projectId });

	// TODO: probably should have only one role per user

	// do the query (need cast here)
	const records = await q.then() as any[];

	const roles = records.map(r => r.name);

	const privileges = [];
	for (const role of roles) {
		const privs = privilegesByProjectRoles[role];
		privileges.push(...privs);
	}

	return privileges;

}