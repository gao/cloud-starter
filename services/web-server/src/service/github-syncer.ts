
import { getIssues } from './github';
import { ticketDao, projectDao } from '../da/daos';
import { Ticket } from '../da/entities';
import { Context } from '../context';

export async function syncIssues(ctx: Context, projectId: number) {
	const newTicketIds: number[] = [];

	const project = await projectDao.get(ctx, projectId);

	if (!project.ghFullName) {
		throw new Error(`Cannot sync github issue for project ${project.id} ${project.name} as it not linked to a github repo`);
	}

	// We get the github issues from the API and the tickets from the db
	// Note: We can do that in parallel and then wait for both to resolve
	const issuesP = await getIssues(ctx, project.ghFullName);
	const ticketsP = await ticketDao.list(ctx, { projectId });

	// Wait for both to be resolved
	// Note: Here the types will be correctly inferred!!
	const [issues, tickets] = await Promise.all([issuesP, ticketsP]);

	// put the tickets in a map by ghId
	const kvs = tickets.map((t): [number, Ticket] => {
		const r: [number, Ticket] = [t.ghId!, t];
		return r;
	});
	const ticketByGhId = new Map(kvs);

	for (const issue of issues) {
		const t = ticketByGhId.get(issue.id);
		if (ticketByGhId.get(issue.id) == null) {
			let title = issue.title as string;
			title = title.substring(0, 127);

			const newTicketData: Partial<Ticket> = {
				projectId,
				title,
				ghId: issue.id,
				ghTitle: title,
				ghNumber: issue.number
			}
			const ticketId = await ticketDao.create(ctx, newTicketData);
			newTicketIds.push(ticketId);
		}
	}

	return newTicketIds;
}
