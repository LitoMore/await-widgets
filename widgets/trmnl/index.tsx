import {Image} from 'await';

type JsonObject = Record<string, unknown>;

const imageUrlStoreKey = 'trmnl.imageUrl';
const defaultRefreshInterval = 30 * 60 * 1000;

// @panel {type:'password'}
const trmnlDeviceApiKey = '';
// @panel
const apiBaseUrl = 'https://trmnl.com';
// @panel
const apiPath = '/api/display';
// @panel
const colorInvert = true;
// @panel
const useTransparent = true;

function objectValue(value: unknown): JsonObject | undefined {
	if (value && typeof value === 'object' && !Array.isArray(value)) {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
		return value as JsonObject;
	}

	return undefined;
}

function stringValue(value: unknown): string | undefined {
	if (typeof value === 'string' && value.trim()) {
		return value.trim();
	}

	if (typeof value === 'number' && Number.isFinite(value)) {
		return String(value);
	}

	return undefined;
}

function firstString(
	object: JsonObject | undefined,
	keys: string[],
): string | undefined {
	if (!object) {
		return undefined;
	}

	for (const key of keys) {
		const value = stringValue(object[key]);
		if (value) {
			return value;
		}
	}

	return undefined;
}

function storeImageUrl(imageUrl: string | undefined): void {
	if (imageUrl) {
		AwaitStore.set(imageUrlStoreKey, imageUrl);
	} else {
		AwaitStore.delete(imageUrlStoreKey);
	}
}

async function loadScreen(): Promise<string | undefined> {
	const apiKey = trmnlDeviceApiKey.trim();
	if (!apiKey) {
		return undefined;
	}

	try {
		const baseUrl = apiBaseUrl.trim().replace(/\/+$/v, '');
		const path = apiPath.trim().replace(/^\/+/v, '') || 'api/display';
		const response = await AwaitNetwork.request(`${baseUrl}/${path}`, {
			headers: {
				'Access-Token': apiKey,
				Accept: 'application/json',
			},
		});

		if (response.code === 200) {
			const payload = JSON.parse(response.data) as unknown;
			const root = objectValue(payload);
			const imageUrl = firstString(root, ['image_url', 'imageUrl']);
			if (imageUrl) {
				storeImageUrl(imageUrl);
			}

			return firstString(root, ['refresh_rate']);
		}
	} catch {
		// Keep the last image and retry on the next scheduled update.
	}

	return undefined;
}

function getNextUpdate(refreshRate: string | undefined, date: Date): Date {
	const seconds = Number(refreshRate);
	const update = new Date(date.getTime() + seconds * 1000);
	if (seconds > 0 && Number.isFinite(update.getTime())) {
		return update;
	}

	return new Date(date.getTime() + defaultRefreshInterval);
}

function widget() {
	return (
		<Image
			url={AwaitStore.string(imageUrlStoreKey)}
			resizable
			aspectRatio="fit"
			maxSides
			background={1}
			compositingGroup
			colorInvert={colorInvert}
			luminanceToAlpha={useTransparent}
			colorInvert_={useTransparent}
		/>
	);
}

async function widgetTimeline(): Promise<Timeline> {
	const refreshRate = await loadScreen();
	const date = new Date();
	return {
		entries: [{date}],
		update: getNextUpdate(refreshRate, date),
	};
}

Await.define({
	widget,
	widgetTimeline,
});
