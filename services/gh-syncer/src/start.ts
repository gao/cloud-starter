require('../../common/ts/setup-module-aliases');
import { queuePop } from 'common/queue';
import { syncLabels, syncIssues } from './github-syncer';

start();

interface ghSyncerMessage {
	projectId: number;
}

async function start() {
	console.log('gh-syncer started 5');

	const queueName = 'gh-syncer.todo';
	for (; true;) {

		try {
			const msg: ghSyncerMessage = await queuePop(queueName);
			const projectId = msg.projectId;

			const syncedLabelIds = await syncLabels(projectId);
			const syncedTicketIds = await syncIssues(projectId);
			console.log(`${queueName} done for projectId: , labels synced: ${projectId} ${syncedLabelIds.length}, ticket synced: ${syncedTicketIds.length}`);

		} catch (ex) {
			console.log('Error in queue ${queueName}', ex);
		}
	}

}