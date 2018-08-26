
import * as crypto from 'crypto';

import { newBar } from "shared/foo";
import { randomString } from "common/utils";

describe("test-dev", function () {

	it('test-bar', async function () {
		console.log('test-bar', newBar);
		console.log('common utils', randomString);
	})

	it('test-dev-crypto', async function () {

		const secret = 'abcdefg';

		const two = crypto.createHmac('sha256', secret).update('Some cat').digest('hex');
		const three = crypto.createHmac('sha256', secret).update('Some cat').digest('hex');
		console.log(`aaa ${two}\n${three}`);
	});

	it('test-dev-hello', async function () {
		console.log('hello 2')
	})


});