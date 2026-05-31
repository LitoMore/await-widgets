import {Color, HStack, Link, Spacer, Text, VStack, ZStack} from 'await';

const feedStoreKeyPrefix = 'rss-feed.feed.';
const feedStatusStoreKeyPrefix = 'rss-feed.status.';
const defaultRssLink = 'https://github.blog/feed';
const maxFeedItems = 12;
const fallbackFeedTitle = 'RSS Feed';

// @panel
const rssLink = 'https://github.blog/feed';
// @panel {type:'menu',items:['featured','list']}
const layout = 'featured';
// @panel {type:'menu',items:['per hour','per 6 hours','per day']}
const updateInterval = 'per hour';

type FeedLayout = 'featured' | 'list';
type UpdateInterval = 'per day' | 'per hour' | 'per 6 hours';

type FeedItem = {
	readonly content?: string;
	readonly description?: string;
	readonly link?: string;
	readonly pubDate?: string;
	readonly title?: string;
};

type FeedRecord = {
	readonly description?: string;
	readonly fetchedAt: number;
	readonly items: FeedItem[];
	readonly link?: string;
	readonly title?: string;
};

type FeedStatus = {
	readonly error?: string;
	readonly fetchedAt: number;
	readonly url: string;
};

type JsonObject = Record<string, unknown>;

type Breakpoint = {
	readonly compact: boolean;
	readonly roomy: boolean;
};

type Palette = {
	readonly accent: string;
	readonly background: string;
	readonly divider: string;
	readonly primary: string;
	readonly secondary: string;
	readonly tertiary: string;
};

type LayoutMetrics = {
	readonly bodyFontSize: number;
	readonly compact: boolean;
	readonly featuredDescriptionLines: number;
	readonly featuredTitleLines: number;
	readonly headerFontSize: number;
	readonly listCount: number;
	readonly listTitleFontSize: number;
	readonly metaFontSize: number;
	readonly padding: number;
	readonly rowDescriptionLines: number;
	readonly rowHeight: number;
	readonly rowTitleLines: number;
	readonly sectionGap: number;
	readonly showHeaderMeta: boolean;
	readonly showListDescriptions: boolean;
	readonly titleFontSize: number;
};

type ListRowOptions = {
	readonly date: Date;
	readonly index: number;
	readonly item: FeedItem;
	readonly lastIndex: number;
	readonly metrics: LayoutMetrics;
	readonly palette: Palette;
};

type ResponsiveNumber = {
	readonly compact: number;
	readonly default: number;
	readonly roomy: number;
};

type FeaturedLineOptions = {
	readonly bodyFontSize: number;
	readonly metaFontSize: number;
	readonly minLines: number;
	readonly padding: number;
	readonly sectionGap: number;
	readonly size: Size;
	readonly titleFontSize: number;
	readonly titleLines: number;
};

function widget(entry: WidgetEntry) {
	const rawLink = rssLink.trim();
	const feedUrl = getFeedUrl();
	const palette = getPalette(entry.colorScheme);
	const metrics = getLayoutMetrics(entry.size);

	if (!feedUrl) {
		return renderMessage(
			palette,
			metrics,
			rawLink ? 'Invalid RSS link' : fallbackFeedTitle,
			rawLink
				? 'Use an http or https RSS feed URL.'
				: 'Set rssLink in the widget panel.',
		);
	}

	const feed = getStoredFeed(feedUrl);
	const status = getStoredStatus(feedUrl);

	if (!feed || feed.items.length === 0) {
		return renderMessage(
			palette,
			metrics,
			fallbackFeedTitle,
			status?.error ?? 'Waiting for feed content.',
		);
	}

	const feedLayout = normalizeLayout(layout);

	if (feedLayout === 'featured') {
		return renderFeatured(feed, palette, metrics, entry.date);
	}

	return (
		<ZStack clipped maxSides>
			<Color value={palette.background} />
			<VStack
				alignment="leading"
				maxSides
				padding={metrics.padding}
				spacing={metrics.sectionGap}
			>
				{renderHeader(feed, palette, metrics, entry.date)}
				{renderList(feed, palette, metrics, entry.date)}
			</VStack>
		</ZStack>
	);
}

async function widgetTimeline(): Promise<Timeline> {
	const interval = normalizeUpdateInterval(updateInterval);
	await loadFeed();

	return {
		entries: getTimelineDates(new Date(), interval).map((date) => ({date})),
		update: 'end',
	};
}

function renderHeader(
	feed: FeedRecord,
	palette: Palette,
	metrics: LayoutMetrics,
	date: Date,
) {
	const title = feed.title ?? fallbackFeedTitle;
	const updated = metrics.showHeaderMeta
		? formatFetchedAt(feed.fetchedAt, date)
		: undefined;

	return (
		<HStack alignment="center" maxWidth="max" spacing={8}>
			<Text
				fontSize={metrics.headerFontSize}
				fontWeight={700}
				foreground={palette.accent}
				lineLimit={1}
				minimumScaleFactor={0.65}
				value={title}
			/>
			<Spacer minLength={4} />
			{updated ? (
				<Text
					fontSize={metrics.metaFontSize}
					foreground={palette.tertiary}
					lineLimit={1}
					minimumScaleFactor={0.7}
					textAlignment="trailing"
					value={updated}
				/>
			) : undefined}
		</HStack>
	);
}

function renderFeatured(
	feed: FeedRecord,
	palette: Palette,
	metrics: LayoutMetrics,
	date: Date,
) {
	const [item] = feed.items;
	const meta = getItemMeta(item, date);
	const articleContent = item.content ?? item.description ?? feed.description;
	const content = (
		<ZStack clipped maxSides>
			<Color value={palette.background} />
			<VStack
				alignment="leading"
				maxSides
				padding={metrics.padding}
				spacing={metrics.compact ? 6 : 10}
			>
				<Text
					fontSize={metrics.titleFontSize}
					fontWeight={800}
					foreground={palette.primary}
					lineHeight="tight"
					lineLimit={metrics.featuredTitleLines}
					minimumScaleFactor={0.65}
					value={item.title ?? fallbackFeedTitle}
				/>
				{articleContent ? (
					<Text
						fontSize={metrics.bodyFontSize}
						foreground={palette.secondary}
						lineHeight="tight"
						lineLimit={metrics.featuredDescriptionLines}
						minimumScaleFactor={0.7}
						value={articleContent}
					/>
				) : undefined}
				<Spacer minLength={0} />
				{meta ? (
					<Text
						fontSize={metrics.metaFontSize}
						foreground={palette.tertiary}
						lineLimit={1}
						value={meta}
					/>
				) : undefined}
			</VStack>
		</ZStack>
	);

	return renderLinkedWidget(item.link, content);
}

function renderList(
	feed: FeedRecord,
	palette: Palette,
	metrics: LayoutMetrics,
	date: Date,
) {
	const items = feed.items.slice(0, metrics.listCount);
	const lastIndex = items.length - 1;

	return (
		<VStack alignment="leading" maxHeight="max" maxWidth="max" spacing={0}>
			{items.map((item, index) =>
				renderListRow({date, index, item, lastIndex, metrics, palette}),
			)}
		</VStack>
	);
}

function renderListRow(options: ListRowOptions) {
	const {date, index, item, lastIndex, metrics, palette} = options;
	const meta = getItemMeta(item, date);
	const row = (
		<VStack
			alignment="leading"
			height={metrics.rowHeight}
			maxWidth="max"
			padding={{vertical: metrics.compact ? 4 : 6}}
			spacing={metrics.compact ? 2 : 4}
		>
			<Text
				fontSize={metrics.listTitleFontSize}
				fontWeight={700}
				foreground={palette.primary}
				lineHeight="tight"
				lineLimit={metrics.rowTitleLines}
				minimumScaleFactor={0.7}
				value={
					item.title ?? item.description ?? item.content ?? fallbackFeedTitle
				}
			/>
			{metrics.showListDescriptions && item.description ? (
				<Text
					fontSize={metrics.bodyFontSize}
					foreground={palette.secondary}
					lineHeight="tight"
					lineLimit={metrics.rowDescriptionLines}
					value={item.description}
				/>
			) : undefined}
			{meta ? (
				<Text
					fontSize={metrics.metaFontSize}
					foreground={palette.tertiary}
					lineLimit={1}
					value={meta}
				/>
			) : undefined}
		</VStack>
	);

	return (
		<VStack alignment="leading" maxWidth="max" spacing={0}>
			{renderLinkedView(item.link, row)}
			{index < lastIndex ? (
				<Color
					height={1}
					maxWidth="max"
					opacity={0.55}
					value={palette.divider}
				/>
			) : undefined}
		</VStack>
	);
}

function renderLinkedView(
	url: string | undefined,
	content: NativeView,
): NativeView {
	if (!url) {
		return content;
	}

	return (
		<Link maxWidth="max" url={url}>
			{content}
		</Link>
	);
}

function renderLinkedWidget(
	url: string | undefined,
	content: NativeView,
): NativeView {
	if (!url) {
		return content;
	}

	return (
		<Link maxSides url={url}>
			{content}
		</Link>
	);
}

function renderMessage(
	palette: Palette,
	metrics: LayoutMetrics,
	title: string,
	message: string,
) {
	return (
		<ZStack clipped maxSides>
			<Color value={palette.background} />
			<VStack
				alignment="center"
				maxSides
				padding={metrics.padding}
				spacing={metrics.compact ? 6 : 10}
			>
				<Spacer minLength={0} />
				<Text
					fontSize={metrics.titleFontSize}
					fontWeight={800}
					foreground={palette.primary}
					lineLimit={2}
					minimumScaleFactor={0.65}
					textAlignment="center"
					value={title}
				/>
				<Text
					fontSize={metrics.bodyFontSize}
					foreground={palette.secondary}
					lineLimit={3}
					minimumScaleFactor={0.7}
					textAlignment="center"
					value={message}
				/>
				<Spacer minLength={0} />
			</VStack>
		</ZStack>
	);
}

async function loadFeed(): Promise<void> {
	const feedUrl = getFeedUrl();

	if (!feedUrl) {
		return;
	}

	try {
		const response = await AwaitNetwork.request(feedUrl, {
			headers: {
				Accept:
					'application/rss+xml, application/atom+xml, application/xml, text/xml, */*',
			},
		});

		if (response.code < 200 || response.code >= 300) {
			storeStatus(feedUrl, `Feed request failed (${response.code}).`);
			return;
		}

		const feed = parseFeed(response.data);
		if (feed.items.length === 0) {
			storeStatus(feedUrl, 'No posts found.');
			return;
		}

		const fetchedAt = Date.now();
		AwaitStore.set(getFeedStoreKey(feedUrl), {
			...feed,
			fetchedAt,
		});
		AwaitStore.set(getFeedStatusStoreKey(feedUrl), {fetchedAt, url: feedUrl});
	} catch {
		storeStatus(feedUrl, 'Feed request failed.');
	}
}

function parseFeed(xml: string): Omit<FeedRecord, 'fetchedAt'> {
	const channel =
		getElementContent(xml, 'channel') ?? getElementContent(xml, 'feed');
	const feedContent = channel ?? xml;
	const title = getElementText(feedContent, ['title']);
	const description = getElementText(feedContent, ['description', 'subtitle']);
	const link = getLink(feedContent);
	const items: FeedItem[] = [];
	const itemExpression =
		/<item(?:\s[^>]*)?>([\s\S]*?)<\/item>|<entry(?:\s[^>]*)?>([\s\S]*?)<\/entry>/giv;
	let itemMatch = itemExpression.exec(xml);

	while (itemMatch && items.length < maxFeedItems) {
		const itemContent = itemMatch[1] ?? itemMatch[2] ?? '';
		const item = normalizeParsedItem({
			content: getElementText(itemContent, ['content:encoded', 'content']),
			description: getElementText(itemContent, ['description', 'summary']),
			link: getLink(itemContent),
			pubDate: getElementText(itemContent, [
				'pubDate',
				'published',
				'updated',
				'dc:date',
			]),
			title: getElementText(itemContent, ['title']),
		});

		if (item) {
			items.push(item);
		}

		itemMatch = itemExpression.exec(xml);
	}

	return {
		description,
		items,
		link,
		title,
	};
}

function normalizeParsedItem(item: FeedItem): FeedItem | undefined {
	const title = truncateText(item.title, 180);
	const content = truncateText(item.content, 2400);
	const description = truncateText(item.description, 600);
	const link = normalizeOptionalUrl(item.link);
	const pubDate = truncateText(item.pubDate, 80);

	if (!title && !description && !content) {
		return undefined;
	}

	return {
		content,
		description,
		link,
		pubDate,
		title,
	};
}

function getElementContent(source: string, tag: string): string | undefined {
	const tagName = sanitizeTagName(tag);
	const expression = new RegExp(
		String.raw`<${tagName}(?:\s[^>]*)?>([\s\S]*?)<\/${tagName}>`,
		'iv',
	);
	const match = expression.exec(source);

	return match?.[1];
}

function getElementText(source: string, tags: string[]): string | undefined {
	for (const tag of tags) {
		const content = getElementContent(source, tag);
		if (!content) {
			continue;
		}

		const text = cleanText(content);
		if (text) {
			return text;
		}
	}

	return undefined;
}

function getLink(source: string): string | undefined {
	const textLink = /<link(?:\s[^>]*)?>([\s\S]*?)<\/link>/iv.exec(source);
	const cleanedTextLink = textLink ? cleanText(textLink[1]) : undefined;

	if (cleanedTextLink) {
		return normalizeOptionalUrl(cleanedTextLink);
	}

	const hrefLink = /<link\b[^>]*\bhref=(["'])(.*?)\1[^>]*>/iv.exec(source);
	const cleanedHrefLink = hrefLink ? cleanText(hrefLink[2]) : undefined;

	if (cleanedHrefLink) {
		return normalizeOptionalUrl(cleanedHrefLink);
	}

	const guidLink = getElementText(source, ['guid']);

	return normalizeOptionalUrl(guidLink);
}

function cleanText(value: string): string {
	return decodeEntities(value)
		.replaceAll(/<!\[CDATA\[([\s\S]*?)\]\]>/giv, '$1')
		.replaceAll(/<[^>]+>/gv, ' ')
		.replaceAll(/\s+/gv, ' ')
		.trim();
}

function decodeEntities(value: string): string {
	const namedEntities: Record<string, string> = {
		amp: '&',
		apos: "'",
		gt: '>',
		lt: '<',
		nbsp: ' ',
		quot: '"',
	};

	return value
		.replaceAll(/&#x([\da-f]+);/giv, (_match, code: string) =>
			decodeCodePoint(code, 16),
		)
		.replaceAll(/&#(\d+);/gv, (_match, code: string) =>
			decodeCodePoint(code, 10),
		)
		.replaceAll(/&([a-z]+);/giv, (match, name: string) => {
			const entity = namedEntities[name.toLowerCase()];

			return entity ?? match;
		});
}

function decodeCodePoint(value: string, radix: number): string {
	const codePoint = Number.parseInt(value, radix);

	if (!Number.isFinite(codePoint) || codePoint <= 0 || codePoint > 1_114_111) {
		return '';
	}

	return String.fromCodePoint(codePoint);
}

function getStoredFeed(feedUrl: string): FeedRecord | undefined {
	const value = AwaitStore.get<unknown>(getFeedStoreKey(feedUrl));
	const object = objectValue(value);

	if (!object) {
		return undefined;
	}

	const items = Array.isArray(object.items)
		? object.items
				.map((item) => normalizeStoredItem(item))
				.filter((item): item is FeedItem => item !== undefined)
		: [];

	if (items.length === 0) {
		return undefined;
	}

	return {
		description: stringValue(object.description),
		fetchedAt: numberValue(object.fetchedAt, 0),
		items,
		link: stringValue(object.link),
		title: stringValue(object.title),
	};
}

function getStoredStatus(feedUrl: string): FeedStatus | undefined {
	const value = AwaitStore.get<unknown>(getFeedStatusStoreKey(feedUrl));
	const object = objectValue(value);

	if (!object) {
		return undefined;
	}

	return {
		error: stringValue(object.error),
		fetchedAt: numberValue(object.fetchedAt, 0),
		url: stringValue(object.url) ?? feedUrl,
	};
}

function normalizeStoredItem(value: unknown): FeedItem | undefined {
	const object = objectValue(value);

	if (!object) {
		return undefined;
	}

	const item = normalizeParsedItem({
		content: stringValue(object.content),
		description: stringValue(object.description),
		link: stringValue(object.link),
		pubDate: stringValue(object.pubDate),
		title: stringValue(object.title),
	});

	return item;
}

function storeStatus(feedUrl: string, error: string): void {
	AwaitStore.set(getFeedStatusStoreKey(feedUrl), {
		error,
		fetchedAt: Date.now(),
		url: feedUrl,
	});
}

function getFeedUrl(): string {
	const value = rssLink.trim() || defaultRssLink;

	const normalized = value.startsWith('feed://')
		? `https://${value.slice('feed://'.length)}`
		: value;
	const withProtocol = /^[a-z][a-z\d+.-]*:\/\//iv.test(normalized)
		? normalized
		: `https://${normalized}`;

	if (!/^https?:\/\//iv.test(withProtocol)) {
		return '';
	}

	return withProtocol;
}

function normalizeOptionalUrl(value: string | undefined): string | undefined {
	if (!value) {
		return undefined;
	}

	const trimmed = value.trim();

	if (/^https?:\/\//iv.test(trimmed)) {
		return trimmed;
	}

	return undefined;
}

function getFeedStoreKey(feedUrl: string): string {
	return `${feedStoreKeyPrefix}${hashString(feedUrl)}`;
}

function getFeedStatusStoreKey(feedUrl: string): string {
	return `${feedStatusStoreKeyPrefix}${hashString(feedUrl)}`;
}

function hashString(value: string): string {
	let hash = 0;

	for (const character of value) {
		hash = (hash * 131 + (character.codePointAt(0) ?? 0)) % 1_000_000_007;
	}

	return hash.toString(36);
}

function getLayoutMetrics(size: Size): LayoutMetrics {
	const compact = size.width < 220 || size.height < 180;
	const roomy = size.width >= 500 && size.height >= 300;
	const breakpoint = {compact, roomy};
	const bodyFontSize = responsiveNumber(breakpoint, {
		compact: 11,
		default: 13,
		roomy: 15,
	});
	const metaFontSize = responsiveNumber(breakpoint, {
		compact: 9,
		default: 10,
		roomy: 12,
	});
	const padding = responsiveNumber(breakpoint, {
		compact: 8,
		default: 14,
		roomy: 18,
	});
	const sectionGap = compact ? 6 : 10;
	const titleFontSize = responsiveNumber(breakpoint, {
		compact: 17,
		default: 22,
		roomy: 28,
	});
	const featuredTitleLines = responsiveNumber(breakpoint, {
		compact: 3,
		default: 3,
		roomy: 4,
	});
	const headerHeight = compact ? 16 : 22;
	const rowHeight = responsiveNumber(breakpoint, {
		compact: 38,
		default: 52,
		roomy: 62,
	});
	const usableListHeight = Math.max(
		rowHeight,
		size.height - padding * 2 - headerHeight - 8,
	);
	const maxRows = roomy ? 8 : 5;

	return {
		bodyFontSize,
		compact,
		featuredDescriptionLines: getFeaturedDescriptionLines({
			bodyFontSize,
			metaFontSize,
			minLines: responsiveNumber(breakpoint, {
				compact: 3,
				default: 5,
				roomy: 8,
			}),
			padding,
			sectionGap,
			size,
			titleFontSize,
			titleLines: featuredTitleLines,
		}),
		featuredTitleLines,
		headerFontSize: compact ? 11 : 12,
		listCount: Math.max(
			1,
			Math.min(maxRows, Math.floor(usableListHeight / rowHeight)),
		),
		listTitleFontSize: responsiveNumber(breakpoint, {
			compact: 12,
			default: 14,
			roomy: 16,
		}),
		metaFontSize,
		padding,
		rowDescriptionLines: roomy ? 2 : 1,
		rowHeight,
		rowTitleLines: compact ? 1 : 2,
		sectionGap,
		showHeaderMeta: size.width >= 260,
		showListDescriptions: size.width >= 240 && size.height >= 220,
		titleFontSize,
	};
}

function getFeaturedDescriptionLines(options: FeaturedLineOptions): number {
	const contentHeight = Math.max(0, options.size.height - options.padding * 2);
	const reservedHeight =
		options.titleFontSize * options.titleLines +
		options.metaFontSize +
		options.sectionGap * 2;
	const lineHeight = Math.max(1, options.bodyFontSize * 1.15);
	const availableLines = Math.floor(
		(contentHeight - reservedHeight) / lineHeight,
	);

	return Math.max(options.minLines, availableLines);
}

function responsiveNumber(
	breakpoint: Breakpoint,
	value: ResponsiveNumber,
): number {
	if (breakpoint.compact) {
		return value.compact;
	}

	if (breakpoint.roomy) {
		return value.roomy;
	}

	return value.default;
}

function getPalette(colorScheme: ColorScheme): Palette {
	if (colorScheme === 'dark') {
		return {
			accent: '2DD4BF',
			background: '0B0F14',
			divider: '334155',
			primary: 'F8FAFC',
			secondary: 'CBD5E1',
			tertiary: '94A3B8',
		};
	}

	return {
		accent: '0F766E',
		background: 'F8FAFC',
		divider: 'CBD5E1',
		primary: '111827',
		secondary: '475569',
		tertiary: '64748B',
	};
}

function getItemMeta(item: FeedItem, date: Date): string | undefined {
	if (!item.pubDate) {
		return undefined;
	}

	return formatDate(item.pubDate, date);
}

function formatFetchedAt(value: number, date: Date): string | undefined {
	if (value <= 0) {
		return undefined;
	}

	const formatted = formatRelativeTime(value, date.getTime());

	return formatted ? `Updated ${formatted}` : undefined;
}

function formatDate(value: string, date: Date): string | undefined {
	const timestamp = Date.parse(value);

	if (!Number.isFinite(timestamp)) {
		return undefined;
	}

	const relative = formatRelativeTime(timestamp, date.getTime());

	if (relative) {
		return relative;
	}

	return formatShortDate(new Date(timestamp), date);
}

function formatRelativeTime(
	timestamp: number,
	now: number,
): string | undefined {
	const difference = now - timestamp;

	if (difference < 0) {
		return undefined;
	}

	const minutes = Math.floor(difference / 60_000);
	if (minutes < 1) {
		return 'just now';
	}

	if (minutes < 60) {
		return `${minutes}m ago`;
	}

	const hours = Math.floor(minutes / 60);
	if (hours < 24) {
		return `${hours}h ago`;
	}

	const days = Math.floor(hours / 24);
	if (days < 7) {
		return `${days}d ago`;
	}

	return undefined;
}

function formatShortDate(date: Date, now: Date): string {
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');

	if (date.getFullYear() === now.getFullYear()) {
		return `${month}/${day}`;
	}

	return `${date.getFullYear()}-${month}-${day}`;
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

function normalizeLayout(value: string): FeedLayout {
	if (value === 'featured' || value === 'list') {
		return value;
	}

	return 'featured';
}

function normalizeUpdateInterval(value: string): UpdateInterval {
	if (value === 'per hour' || value === 'per 6 hours' || value === 'per day') {
		return value;
	}

	return 'per hour';
}

function sanitizeTagName(value: string): string {
	return value.replaceAll(/[^A-Za-z0-9:-]/gv, '');
}

function truncateText(
	value: string | undefined,
	maxLength: number,
): string | undefined {
	if (!value) {
		return undefined;
	}

	const normalized = cleanText(value);

	if (normalized.length <= maxLength) {
		return normalized;
	}

	return `${normalized.slice(0, Math.max(0, maxLength - 3)).trimEnd()}...`;
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

Await.define({
	widget,
	widgetTimeline,
});
