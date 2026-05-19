import {Color, Svg, ZStack} from 'await';

const centerIconRatio = 2;
const brightThreshold = 0.72;

// @panel {type:'slider',min:12,max:96,step:1}
const iconSize = 24;
// @panel {type:'slider',min:0,max:48,step:1}
const iconGap = 12;
// @panel {type:'menu',items:['auto','light','dark']}
const colorScheme = 'auto';
// @panel {type:'color'}
const backgroundColor = '';
// @panel
const simpleIconsVersion = 'latest';
// @panel {type:'menu',items:['per minute','per hour','per day']}
const updateInterval = 'per hour';
// @panel
const showCenterIcon = false;
// @panel
const hideWhiteIcons = true;
// @panel
const hideBlackIcons = true;

type IconItem = {
	hex: string;
	slug: string;
};

type JsonObject = Record<string, unknown>;

type Scheme = 'dark' | 'light';

type UpdateInterval = 'per day' | 'per hour' | 'per minute';

type Position = {
	readonly x: number;
	readonly y: number;
};

type Grid = {
	readonly columns: number;
	readonly originX: number;
	readonly originY: number;
	readonly rows: number;
};

const iconStoreKeyPrefix = 'simple-icons-wall.icons.';

function widget(entry: WidgetEntry) {
	const scheme = normalizeScheme(colorScheme, entry.colorScheme);
	const interval = normalizeUpdateInterval(updateInterval);
	const fillColor = backgroundColor || (scheme === 'light' ? 'white' : 'black');
	const centerIconColor = scheme === 'light' ? '000000' : 'FFFFFF';
	const size = normalizePositive(iconSize, 28);
	const gap = normalizeNonNegative(iconGap);
	const icons = getStoredIcons();
	const grid = getGrid({
		gap,
		height: entry.size.height,
		size,
		width: entry.size.width,
	});
	const shuffledIcons = shuffleIcons(
		filterIcons(icons, scheme),
		getShuffleSeed(entry.date, interval),
	);
	const visibleIcons = fillIcons(shuffledIcons, grid.rows * grid.columns);
	const ratio = Math.min(
		(grid.rows % 2) + centerIconRatio,
		grid.rows,
		grid.columns,
	);
	const isOddColumn = (grid.columns - ratio) % 2 === 1;
	const centerRow = Math.max(0, Math.ceil((grid.rows - ratio) / 2));
	const centerColumn = Math.max(0, Math.ceil((grid.columns - ratio) / 2));
	const centerIndex = centerRow * grid.columns + centerColumn;
	const centerPosition = getIconPosition({
		columns: grid.columns,
		gap,
		index: centerIndex,
		originX: grid.originX,
		originY: grid.originY,
		size,
	});
	const centerSize = size * ratio + gap * (ratio - 1);
	const ignoredIndexes = showCenterIcon
		? getIgnoredIndexes({
				centerColumn,
				centerRow,
				columns: grid.columns,
				isOddColumn,
				ratio,
				rows: grid.rows,
			})
		: new Set<number>();

	return (
		<ZStack clipped maxSides>
			<Color value={fillColor} />
			{visibleIcons.map((icon, index) => {
				if (ignoredIndexes.has(index)) {
					return;
				}

				const {x, y} = getIconPosition({
					columns: grid.columns,
					gap,
					index,
					originX: grid.originX,
					originY: grid.originY,
					size,
				});

				return (
					<ZStack
						frame={{width: size, height: size}}
						id={`${icon.slug}-${index}`}
						offset={getOffset({
							height: entry.size.height,
							size,
							width: entry.size.width,
							x,
							y,
						})}
					>
						<Color
							maxSides
							mask={<Svg maxSides url={getIconUrl(icon.slug)} />}
							value={getIconColor(icon.hex, scheme)}
						/>
					</ZStack>
				);
			})}
			{showCenterIcon ? (
				<ZStack
					frame={{width: centerSize, height: centerSize}}
					offset={getOffset({
						height: entry.size.height,
						size: centerSize,
						width: entry.size.width,
						x: centerPosition.x - (isOddColumn ? (size + gap) / 2 : 0),
						y: centerPosition.y,
					})}
				>
					<Color
						maxSides
						mask={<Svg maxSides url={getIconUrl('simpleicons')} />}
						value={centerIconColor}
					/>
				</ZStack>
			) : undefined}
		</ZStack>
	);
}

async function widgetTimeline(): Promise<Timeline> {
	const interval = normalizeUpdateInterval(updateInterval);
	await loadIcons();

	return {
		entries: getTimelineDates(new Date(), interval).map((date) => ({date})),
		update: 'end',
	};
}

function getGrid(options: {
	gap: number;
	height: number;
	size: number;
	width: number;
}): Grid {
	const stride = options.size + options.gap;
	const columns = Math.max(
		1,
		Math.floor((options.width - options.gap) / stride),
	);
	const rows = Math.max(1, Math.floor((options.height - options.gap) / stride));
	const contentWidth = columns * options.size + (columns - 1) * options.gap;
	const contentHeight = rows * options.size + (rows - 1) * options.gap;

	return {
		columns,
		originX: Math.floor((options.width - contentWidth) / 2),
		originY: Math.floor((options.height - contentHeight) / 2),
		rows,
	};
}

function getIconPosition(options: {
	columns: number;
	gap: number;
	index: number;
	originX: number;
	originY: number;
	size: number;
}): Position {
	const row = Math.floor(options.index / options.columns);
	const column = options.index % options.columns;

	return {
		x: options.originX + column * (options.size + options.gap),
		y: options.originY + row * (options.size + options.gap),
	};
}

function getOffset(options: {
	height: number;
	size: number;
	width: number;
	x: number;
	y: number;
}): Position {
	return {
		x: options.x + options.size / 2 - options.width / 2,
		y: options.y + options.size / 2 - options.height / 2,
	};
}

function getIgnoredIndexes(options: {
	centerColumn: number;
	centerRow: number;
	columns: number;
	isOddColumn: boolean;
	ratio: number;
	rows: number;
}): Set<number> {
	const ignoredIndexes = new Set<number>();
	const width = options.ratio + (options.isOddColumn ? 1 : 0);
	const leftOffset = options.isOddColumn ? 1 : 0;

	for (let row = 0; row < options.ratio; row++) {
		const gridRow = options.centerRow + row;
		if (gridRow < 0 || gridRow >= options.rows) {
			continue;
		}

		for (let column = 0; column < width; column++) {
			const gridColumn = options.centerColumn + column - leftOffset;
			if (gridColumn >= 0 && gridColumn < options.columns) {
				ignoredIndexes.add(gridRow * options.columns + gridColumn);
			}
		}
	}

	return ignoredIndexes;
}

function getIconColor(hex: string, scheme: Scheme): string {
	if (hex === '000000') {
		return scheme === 'light' ? '222222' : 'DDDDDD';
	}

	return hex;
}

function getIconUrl(slug: string): string {
	return getSimpleIconsUrl(`icons/${slug}.svg`);
}

function getIconDataUrl(): string {
	return getSimpleIconsUrl('data/simple-icons.json');
}

function getIconStoreKey(): string {
	return `${iconStoreKeyPrefix}${getSimpleIconsVersion()}`;
}

function getSimpleIconsUrl(path: string): string {
	return `https://cdn.jsdelivr.net/npm/simple-icons@${encodeURIComponent(getSimpleIconsVersion())}/${path}`;
}

function getSimpleIconsVersion(): string {
	const version = simpleIconsVersion.trim();

	return version || 'latest';
}

function getStoredIcons(): IconItem[] {
	return AwaitStore.array<IconItem>(getIconStoreKey(), []);
}

async function loadIcons(): Promise<void> {
	try {
		const response = await AwaitNetwork.request(getIconDataUrl(), {
			headers: {
				Accept: 'application/json',
			},
		});

		if (response.code !== 200) {
			return;
		}

		const icons = parseIconData(response.data);
		if (icons.length > 0) {
			AwaitStore.set(getIconStoreKey(), icons);
		}
	} catch {
		// Keep using the last cached icon data if the CDN request fails.
	}
}

function parseIconData(value: string): IconItem[] {
	try {
		const data = JSON.parse(value) as unknown;
		if (!Array.isArray(data)) {
			return [];
		}

		return data
			.map((item) => normalizeIcon(item))
			.filter((item): item is IconItem => item !== undefined);
	} catch {
		return [];
	}
}

function normalizeIcon(value: unknown): IconItem | undefined {
	const object = objectValue(value);
	const slug = stringValue(object?.slug);
	const hex = stringValue(object?.hex)?.toUpperCase();

	if (!slug || !hex || !isHexColor(hex)) {
		return undefined;
	}

	return {hex, slug};
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

	return undefined;
}

function isHexColor(value: string): boolean {
	return /^[\dA-F]{6}$/v.test(value);
}

function fillIcons(value: IconItem[], total: number): IconItem[] {
	if (value.length === 0 || total <= 0) {
		return [];
	}

	return Array.from({length: total}, (_, index) => value[index % value.length]);
}

function filterIcons(value: IconItem[], scheme: Scheme): IconItem[] {
	return value.filter((icon) => {
		if (hideWhiteIcons && icon.hex === 'FFFFFF') {
			return false;
		}

		if (hideBlackIcons && icon.hex === '000000') {
			return false;
		}

		const brightness = getBrightness(icon.hex);

		return scheme === 'light'
			? brightness <= brightThreshold || icon.hex === '000000'
			: brightness > 0.1 || icon.hex === '000000';
	});
}

function getBrightness(hex: string): number {
	const red = Number.parseInt(hex.slice(0, 2), 16);
	const green = Number.parseInt(hex.slice(2, 4), 16);
	const blue = Number.parseInt(hex.slice(4, 6), 16);

	return (red * 299 + green * 587 + blue * 114) / 255_000;
}

function shuffleIcons(value: IconItem[], seed: number): IconItem[] {
	const result = [...value];
	let state = normalizePositive(seed, 1);

	for (let index = result.length - 1; index > 0; index--) {
		state = (state * 1_664_525 + 1_013_904_223) % 4_294_967_296;
		const swapIndex = state % (index + 1);
		const current = result[index];
		const swap = result[swapIndex];
		result[index] = swap;
		result[swapIndex] = current;
	}

	return result;
}

function getShuffleSeed(date: Date, interval: UpdateInterval): number {
	const values = [date.getFullYear(), date.getMonth() + 1, date.getDate()];

	if (interval === 'per hour' || interval === 'per minute') {
		values.push(date.getHours());
	}

	if (interval === 'per minute') {
		values.push(date.getMinutes());
	}

	const seed = values.reduce(
		(current, value) => (current * 131 + value) % 4_294_967_296,
		17,
	);

	return seed || 1;
}

function getTimelineDates(date: Date, interval: UpdateInterval): Date[] {
	const length = interval === 'per minute' ? 20 : 2;
	const dates = [date];
	let nextDate = date;

	for (let index = 1; index < length; index++) {
		nextDate = getNextDate(nextDate, interval);
		dates.push(nextDate);
	}

	return dates;
}

function getNextDate(date: Date, interval: UpdateInterval): Date {
	const nextDate = new Date(date);

	if (interval === 'per minute') {
		nextDate.setSeconds(0, 0);
		nextDate.setMinutes(nextDate.getMinutes() + 1);
		return nextDate;
	}

	if (interval === 'per hour') {
		nextDate.setMinutes(0, 0, 0);
		nextDate.setHours(nextDate.getHours() + 1);
		return nextDate;
	}

	nextDate.setHours(0, 0, 0, 0);
	nextDate.setDate(nextDate.getDate() + 1);
	return nextDate;
}

function normalizeUpdateInterval(value: string): UpdateInterval {
	if (value === 'per minute' || value === 'per hour' || value === 'per day') {
		return value;
	}

	return 'per hour';
}

function normalizeScheme(value: string, fallback: ColorScheme): Scheme {
	if (value === 'light' || value === 'dark') {
		return value;
	}

	return fallback === 'dark' ? 'dark' : 'light';
}

function normalizePositive(value: number, fallback: number): number {
	if (Number.isFinite(value) && value > 0) {
		return Math.floor(value);
	}

	return fallback;
}

function normalizeNonNegative(value: number): number {
	if (Number.isFinite(value) && value >= 0) {
		return Math.floor(value);
	}

	return 0;
}

Await.define({
	widget,
	widgetTimeline,
});
