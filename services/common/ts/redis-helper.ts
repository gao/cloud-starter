
// send a command if someone need to listen on this.
export function pushDoneMessage(client: any, key: string, info: string) {
	const str = `${key}.done`;
	client.lpush(str, info);
}

export function pushStatusMessage(client: any, key: string, statusJson: string) {
	const str = `${key}.status`;
	client.lpush(str, statusJson);
}