export let subStatus: boolean = false;
export let channelLink = 'http://t.me/test_data12222';

export const setSubStatus = (status: boolean) => {
	subStatus = status;
};

export const setChannelLink = (link: string) => {
	channelLink = link;
};
