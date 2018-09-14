require('../../common/ts/setup-module-aliases');
import { waitForNextMessage } from 'common/queue';

start();

async function start() {
	console.log('gh-syncer started 4');

	const queueName = 'gh-syncer.todo';
	for (; true;) {

		try {
			const msg = await waitForNextMessage(queueName);
			console.log(`result from queue ${queueName}`, msg);
		} catch (ex) {
			console.log('Error in queue ${queueName}', ex);
		}
	}



}