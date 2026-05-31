import {Color, Image, Link, Text, VStack, ZStack} from 'await';

const defaultApiBaseUrl = 'https://production-sfo.browserless.io';
const screenshotStoreKeyPrefix = 'browserless-io.screenshot.';
const screenshotStatusStoreKeyPrefix = 'browserless-io.status.';
const fallbackViewportWidth = 320;
const fallbackViewportHeight = 180;
const maxViewportDimension = 4000;

// @panel {type:'password'}
const browserlessToken = '';
// @panel
const targetUrl = 'https://example.com';
// @panel
const apiBaseUrl = 'https://production-sfo.browserless.io';
// @panel {type:'menu',items:['png','jpeg','webp']}
const imageType = 'webp';
// @panel {type:'slider',min:0,max:100,step:1}
const imageQuality = 85;
// @panel {type:'slider',min:0,max:10000,step:250}
const waitForTimeoutMs = 1000;
// @panel {type:'menu',items:['per 15 minutes','per hour','per 6 hours','per day']}
const updateInterval = 'per hour';

type ImageType = 'jpeg' | 'png' | 'webp';
type UpdateInterval = 'per 15 minutes' | 'per 6 hours' | 'per day' | 'per hour';

type JsonObject = Record<string, unknown>;

type Palette = {
	readonly background: string;
	readonly primary: string;
	readonly secondary: string;
	readonly tertiary: string;
};

type ScreenshotConfig = {
	readonly apiBaseUrl: string;
	readonly deviceScaleFactor: number;
	readonly imageQuality: number;
	readonly imageType: ImageType;
	readonly pageUrl: string;
	readonly token: string;
	readonly viewportHeight: number;
	readonly viewportWidth: number;
	readonly waitForTimeoutMs: number;
};

type ScreenshotRecord = {
	readonly fetchedAt: number;
	readonly imageUrl: string;
	readonly pageUrl: string;
	readonly viewportHeight: number;
	readonly viewportWidth: number;
};

type ScreenshotStatus = {
	readonly error?: string;
	readonly fetchedAt: number;
	readonly pageUrl: string;
};

type Message = {
	readonly message: string;
	readonly title: string;
};

function widget(entry: WidgetEntry) {
	const palette = getPalette(entry.colorScheme);
	const configurationMessage = getConfigurationMessage();

	if (configurationMessage) {
		return renderMessage(
			palette,
			configurationMessage.title,
			configurationMessage.message,
		);
	}

	const config = getScreenshotConfig(entry.size);

	if (!config) {
		return renderMessage(
			palette,
			'Browserless.io',
			'Check the widget panel configuration.',
		);
	}

	const screenshot = getStoredScreenshot(getScreenshotStoreKey(config));
	const status = getStoredStatus(getScreenshotStatusStoreKey(config));

	if (!screenshot) {
		return renderMessage(
			palette,
			'Waiting for screenshot',
			status?.error ?? 'The next timeline refresh will capture this page.',
		);
	}

	return renderLinkedWidget(
		screenshot.pageUrl,
		<ZStack clipped maxSides>
			<Color value={palette.background} />
			<Image
				aspectRatio="fill"
				clipped
				interpolation="high"
				maxSides
				resizable
				url={screenshot.imageUrl}
			/>
		</ZStack>,
	);
}

async function widgetTimeline(context: TimelineContext): Promise<Timeline> {
	const interval = normalizeUpdateInterval(updateInterval);
	await loadScreenshot(context.size);

	return {
		entries: getTimelineDates(new Date(), interval).map((date) => ({date})),
		update: 'end',
	};
}

async function loadScreenshot(size: Size): Promise<void> {
	const config = getScreenshotConfig(size);

	if (!config) {
		return;
	}

	const storeKey = getScreenshotStoreKey(config);
	const statusKey = getScreenshotStatusStoreKey(config);

	try {
		const response = await AwaitNetwork.request(getScreenshotEndpoint(config), {
			body: getScreenshotPayload(config),
			headers: {
				Accept: 'text/plain, application/json, image/*',
				'Cache-Control': 'no-cache',
				'Content-Type': 'application/json',
			},
			method: 'POST',
		});

		if (response.code < 200 || response.code >= 300) {
			storeStatus(
				statusKey,
				config.pageUrl,
				`Screenshot request failed (${response.code}).`,
			);
			return;
		}

		const imageUrl = normalizeScreenshotData(response.data, config.imageType);
		if (!imageUrl) {
			storeStatus(statusKey, config.pageUrl, 'Screenshot response was empty.');
			return;
		}

		AwaitStore.set(storeKey, {
			fetchedAt: Date.now(),
			imageUrl,
			pageUrl: config.pageUrl,
			viewportHeight: config.viewportHeight,
			viewportWidth: config.viewportWidth,
		});
		AwaitStore.delete(statusKey);
	} catch {
		storeStatus(statusKey, config.pageUrl, 'Screenshot request failed.');
	}
}

function renderLinkedWidget(pageUrl: string, content: NativeView) {
	return (
		<Link maxSides url={pageUrl}>
			{content}
		</Link>
	);
}

function renderMessage(palette: Palette, title: string, message: string) {
	return (
		<ZStack clipped maxSides>
			<Color value={palette.background} />
			<VStack maxSides padding={16} spacing={6}>
				<Text
					fontSize={18}
					fontWeight={700}
					foreground={palette.primary}
					lineLimit={2}
					minimumScaleFactor={0.65}
					textAlignment="center"
					value={title}
				/>
				<Text
					fontSize={12}
					foreground={palette.secondary}
					lineLimit={3}
					minimumScaleFactor={0.7}
					textAlignment="center"
					value={message}
				/>
			</VStack>
		</ZStack>
	);
}

function getScreenshotConfig(size: Size): ScreenshotConfig | undefined {
	const token = browserlessToken.trim();
	const pageUrl = normalizeUrl(targetUrl);
	const baseUrl = normalizeApiBaseUrl(apiBaseUrl);

	if (!token || !pageUrl || !baseUrl) {
		return undefined;
	}

	return {
		apiBaseUrl: baseUrl,
		deviceScaleFactor: getDeviceScaleFactor(),
		imageQuality: normalizeQuality(imageQuality),
		imageType: normalizeImageType(imageType),
		pageUrl,
		token,
		viewportHeight: normalizeViewportDimension(
			size.height,
			fallbackViewportHeight,
		),
		viewportWidth: normalizeViewportDimension(
			size.width,
			fallbackViewportWidth,
		),
		waitForTimeoutMs: normalizeWaitForTimeout(waitForTimeoutMs),
	};
}

function getConfigurationMessage(): Message | undefined {
	if (!browserlessToken.trim()) {
		return {
			message: 'Set browserlessToken in the widget panel.',
			title: 'Browserless token required',
		};
	}

	if (!targetUrl.trim()) {
		return {
			message: 'Set targetUrl in the widget panel.',
			title: 'Browserless.io',
		};
	}

	if (!normalizeUrl(targetUrl)) {
		return {
			message: 'Use an http or https page URL.',
			title: 'Invalid target URL',
		};
	}

	if (!normalizeApiBaseUrl(apiBaseUrl)) {
		return {
			message: 'Use an http or https Browserless API base URL.',
			title: 'Invalid API base URL',
		};
	}

	return undefined;
}

function getScreenshotEndpoint(config: ScreenshotConfig): string {
	return `${config.apiBaseUrl}/screenshot?token=${encodeURIComponent(config.token)}`;
}

function getScreenshotPayload(config: ScreenshotConfig): Encodable {
	const options: Record<string, Encodable> = {
		encoding: 'base64',
		fullPage: false,
		type: config.imageType,
	};

	if (config.imageType !== 'png') {
		options.quality = config.imageQuality;
	}

	const payload: Record<string, Encodable> = {
		bestAttempt: true,
		blockConsentModals: true,
		gotoOptions: {
			waitUntil: ['networkidle2'],
		},
		options,
		url: config.pageUrl,
		viewport: {
			deviceScaleFactor: config.deviceScaleFactor,
			hasTouch: config.viewportWidth < 768,
			height: config.viewportHeight,
			isLandscape: config.viewportWidth > config.viewportHeight,
			isMobile: config.viewportWidth < 768,
			width: config.viewportWidth,
		},
	};

	if (config.waitForTimeoutMs > 0) {
		payload.waitForTimeout = config.waitForTimeoutMs;
	}

	return payload;
}

function getScreenshotStoreKey(config: ScreenshotConfig): string {
	return `${screenshotStoreKeyPrefix}${getScreenshotConfigHash(config)}`;
}

function getScreenshotStatusStoreKey(config: ScreenshotConfig): string {
	return `${screenshotStatusStoreKeyPrefix}${getScreenshotConfigHash(config)}`;
}

function getScreenshotConfigHash(config: ScreenshotConfig): string {
	return hashString(
		[
			config.apiBaseUrl,
			config.pageUrl,
			config.imageType,
			config.imageQuality,
			config.viewportWidth,
			config.viewportHeight,
			config.deviceScaleFactor,
			config.waitForTimeoutMs,
		].join('\n'),
	);
}

function getStoredScreenshot(storeKey: string): ScreenshotRecord | undefined {
	const value = AwaitStore.get<unknown>(storeKey);
	const object = objectValue(value);
	const imageUrl = stringValue(object?.imageUrl);
	const pageUrl = stringValue(object?.pageUrl);

	if (!imageUrl || !pageUrl) {
		return undefined;
	}

	return {
		fetchedAt: numberValue(object?.fetchedAt, 0),
		imageUrl,
		pageUrl,
		viewportHeight: numberValue(object?.viewportHeight, fallbackViewportHeight),
		viewportWidth: numberValue(object?.viewportWidth, fallbackViewportWidth),
	};
}

function getStoredStatus(storeKey: string): ScreenshotStatus | undefined {
	const value = AwaitStore.get<unknown>(storeKey);
	const object = objectValue(value);
	const pageUrl = stringValue(object?.pageUrl);

	if (!pageUrl) {
		return undefined;
	}

	return {
		error: stringValue(object?.error),
		fetchedAt: numberValue(object?.fetchedAt, 0),
		pageUrl,
	};
}

function storeStatus(storeKey: string, pageUrl: string, error: string): void {
	AwaitStore.set(storeKey, {
		error,
		fetchedAt: Date.now(),
		pageUrl,
	});
}

function normalizeScreenshotData(
	value: string,
	type: ImageType,
): string | undefined {
	const payload = getScreenshotPayloadData(value);

	if (!payload) {
		return undefined;
	}

	if (payload.startsWith('data:image/')) {
		return payload;
	}

	const base64 = payload.replaceAll(/\s+/gv, '');

	if (!base64) {
		return undefined;
	}

	return `data:${getMimeType(type)};base64,${base64}`;
}

function getScreenshotPayloadData(value: string): string | undefined {
	const trimmed = value.trim();

	if (!trimmed) {
		return undefined;
	}

	if (trimmed.startsWith('"')) {
		const parsed = parseJson(trimmed);

		return stringValue(parsed);
	}

	if (trimmed.startsWith('{')) {
		const parsed = objectValue(parseJson(trimmed));

		return firstString(parsed, ['data', 'base64', 'screenshot', 'image']);
	}

	return trimmed;
}

function getMimeType(type: ImageType): string {
	if (type === 'jpeg') {
		return 'image/jpeg';
	}

	return `image/${type}`;
}

function getPalette(colorScheme: ColorScheme): Palette {
	if (colorScheme === 'dark') {
		return {
			background: '111111',
			primary: 'F8F8F8',
			secondary: 'A1A1A1',
			tertiary: '6E6E6E',
		};
	}

	return {
		background: 'FFFFFF',
		primary: '111111',
		secondary: '5F6368',
		tertiary: '8A8F98',
	};
}

function normalizeUrl(value: string): string | undefined {
	const trimmed = value.trim();

	if (/^https?:\/\/\S+$/iv.test(trimmed)) {
		return trimmed;
	}

	return undefined;
}

function normalizeApiBaseUrl(value: string): string | undefined {
	const trimmed = value.trim();
	const url = trimmed ? normalizeUrl(trimmed) : defaultApiBaseUrl;

	return url?.replace(/\/+$/v, '');
}

function normalizeImageType(value: string): ImageType {
	if (value === 'jpeg' || value === 'png' || value === 'webp') {
		return value;
	}

	return 'png';
}

function normalizeUpdateInterval(value: string): UpdateInterval {
	if (
		value === 'per 15 minutes' ||
		value === 'per hour' ||
		value === 'per 6 hours' ||
		value === 'per day'
	) {
		return value;
	}

	return 'per hour';
}

function normalizeViewportDimension(value: number, fallback: number): number {
	if (!Number.isFinite(value) || value <= 0) {
		return fallback;
	}

	return Math.min(maxViewportDimension, Math.max(1, Math.round(value)));
}

function normalizeQuality(value: number): number {
	if (Number.isFinite(value)) {
		return Math.min(100, Math.max(1, Math.round(value)));
	}

	return 85;
}

function normalizeWaitForTimeout(value: number): number {
	if (Number.isFinite(value)) {
		return Math.min(60_000, Math.max(0, Math.round(value)));
	}

	return 1000;
}

function getDeviceScaleFactor(): number {
	if (Number.isFinite(AwaitUI.displayScale) && AwaitUI.displayScale > 0) {
		return Math.min(4, Math.max(1, Math.round(AwaitUI.displayScale)));
	}

	return 1;
}

function getTimelineDates(date: Date, interval: UpdateInterval): Date[] {
	const dates = [date];
	let nextDate = date;

	for (let index = 1; index < 2; index++) {
		nextDate = getNextDate(nextDate, interval);
		dates.push(nextDate);
	}

	return dates;
}

function getNextDate(date: Date, interval: UpdateInterval): Date {
	const nextDate = new Date(date);

	if (interval === 'per 15 minutes') {
		nextDate.setSeconds(0, 0);
		nextDate.setMinutes(
			nextDate.getMinutes() + 15 - (nextDate.getMinutes() % 15),
		);
		return nextDate;
	}

	if (interval === 'per hour') {
		nextDate.setMinutes(0, 0, 0);
		nextDate.setHours(nextDate.getHours() + 1);
		return nextDate;
	}

	if (interval === 'per 6 hours') {
		nextDate.setMinutes(0, 0, 0);
		nextDate.setHours(nextDate.getHours() + 6 - (nextDate.getHours() % 6));
		return nextDate;
	}

	nextDate.setHours(0, 0, 0, 0);
	nextDate.setDate(nextDate.getDate() + 1);
	return nextDate;
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

function numberValue(value: unknown, fallback: number): number {
	if (typeof value === 'number' && Number.isFinite(value)) {
		return value;
	}

	return fallback;
}

function parseJson(value: string): unknown {
	try {
		return JSON.parse(value) as unknown;
	} catch {
		return undefined;
	}
}

function hashString(value: string): string {
	let hash = 0;

	for (const character of value) {
		hash = (hash * 31 + (character.codePointAt(0) ?? 0)) % 2_147_483_647;
	}

	return hash.toString(36);
}

Await.define({
	widget,
	widgetTimeline,
});
