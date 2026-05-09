import {Color, Svg, ZStack} from 'await';

const centerIconRatio = 2;
const brightThreshold = 0.72;

// @panel {type:'slider',min:12,max:96,step:1}
const iconSize = 22;
// @panel {type:'slider',min:0,max:48,step:1}
const iconGap = 10;
// @panel {type:'menu',items:['auto','light','dark']}
const colorScheme = 'auto';
// @panel {type:'color'}
const backgroundColor = '';
// @panel
const simpleIconsVersion = 'latest';
// @panel {type:'slider',min:1,max:9999,step:1}
const shuffleSeed = 1;
// @panel
const showCenterIcon = false;
// @panel
const hideWhiteIcons = true;
// @panel
const hideBlackIcons = true;

type IconItem = {
	readonly slug: string;
	readonly hex: string;
};

type Scheme = 'dark' | 'light';

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

const icons: IconItem[] = [
	{slug: 'javascript', hex: 'F7DF1E'},
	{slug: 'typescript', hex: '3178C6'},
	{slug: 'react', hex: '61DAFB'},
	{slug: 'nextdotjs', hex: '000000'},
	{slug: 'nodedotjs', hex: '5FA04E'},
	{slug: 'npm', hex: 'CB3837'},
	{slug: 'pnpm', hex: 'F69220'},
	{slug: 'bun', hex: '000000'},
	{slug: 'deno', hex: '000000'},
	{slug: 'vuedotjs', hex: '4FC08D'},
	{slug: 'nuxt', hex: '00DC82'},
	{slug: 'svelte', hex: 'FF3E00'},
	{slug: 'astro', hex: 'BC52EE'},
	{slug: 'vite', hex: '646CFF'},
	{slug: 'webpack', hex: '8DD6F9'},
	{slug: 'rollupdotjs', hex: 'EC4A3F'},
	{slug: 'eslint', hex: '4B32C3'},
	{slug: 'prettier', hex: 'F7B93E'},
	{slug: 'tailwindcss', hex: '06B6D4'},
	{slug: 'sass', hex: 'CC6699'},
	{slug: 'css', hex: '663399'},
	{slug: 'html5', hex: 'E34F26'},
	{slug: 'webcomponentsdotorg', hex: '29ABE2'},
	{slug: 'figma', hex: 'F24E1E'},
	{slug: 'github', hex: '181717'},
	{slug: 'git', hex: 'F05032'},
	{slug: 'gitlab', hex: 'FC6D26'},
	{slug: 'vercel', hex: '000000'},
	{slug: 'netlify', hex: '00C7B7'},
	{slug: 'cloudflare', hex: 'F38020'},
	{slug: 'firebase', hex: 'DD2C00'},
	{slug: 'supabase', hex: '3FCF8E'},
	{slug: 'postgresql', hex: '4169E1'},
	{slug: 'mysql', hex: '4479A1'},
	{slug: 'sqlite', hex: '003B57'},
	{slug: 'mongodb', hex: '47A248'},
	{slug: 'redis', hex: 'FF4438'},
	{slug: 'prisma', hex: '2D3748'},
	{slug: 'docker', hex: '2496ED'},
	{slug: 'kubernetes', hex: '326CE5'},
	{slug: 'nginx', hex: '009639'},
	{slug: 'linux', hex: 'FCC624'},
	{slug: 'apple', hex: '000000'},
	{slug: 'swift', hex: 'F05138'},
	{slug: 'xcode', hex: '147EFB'},
	{slug: 'android', hex: '3DDC84'},
	{slug: 'kotlin', hex: '7F52FF'},
	{slug: 'java', hex: '007396'},
	{slug: 'go', hex: '00ADD8'},
	{slug: 'rust', hex: '000000'},
	{slug: 'python', hex: '3776AB'},
	{slug: 'ruby', hex: 'CC342D'},
	{slug: 'php', hex: '777BB4'},
	{slug: 'laravel', hex: 'FF2D20'},
	{slug: 'dotnet', hex: '512BD4'},
	{slug: 'c', hex: 'A8B9CC'},
	{slug: 'cplusplus', hex: '00599C'},
	{slug: 'sharp', hex: '512BD4'},
	{slug: 'visualstudiocode', hex: '007ACC'},
	{slug: 'vim', hex: '019733'},
	{slug: 'neovim', hex: '57A143'},
	{slug: 'zedindustries', hex: '084CCF'},
	{slug: 'openai', hex: '412991'},
	{slug: 'anthropic', hex: 'D4A27F'},
	{slug: 'ollama', hex: '000000'},
	{slug: 'huggingface', hex: 'FFD21E'},
	{slug: 'tensorflow', hex: 'FF6F00'},
	{slug: 'pytorch', hex: 'EE4C2C'},
	{slug: 'stripe', hex: '635BFF'},
	{slug: 'shopify', hex: '7AB55C'},
	{slug: 'wordpress', hex: '21759B'},
	{slug: 'notion', hex: '000000'},
	{slug: 'obsidian', hex: '7C3AED'},
	{slug: 'slack', hex: '4A154B'},
	{slug: 'discord', hex: '5865F2'},
	{slug: 'telegram', hex: '26A5E4'},
	{slug: 'x', hex: '000000'},
	{slug: 'youtube', hex: 'FF0000'},
	{slug: 'spotify', hex: '1DB954'},
	{slug: 'steam', hex: '000000'},
];

function widget(entry: WidgetEntry) {
	const scheme = normalizeScheme(colorScheme, entry.colorScheme);
	const fillColor = backgroundColor || (scheme === 'light' ? 'white' : 'black');
	const centerIconColor = scheme === 'light' ? '000000' : 'FFFFFF';
	const size = normalizePositive(iconSize, 28);
	const gap = normalizeNonNegative(iconGap);
	const grid = getGrid({
		gap,
		height: entry.size.height,
		size,
		width: entry.size.width,
	});
	const shuffledIcons = shuffleIcons(filterIcons(scheme), shuffleSeed);
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
					// eslint-disable-next-line react/jsx-key
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
	return `https://cdn.jsdelivr.net/npm/simple-icons@${simpleIconsVersion}/icons/${slug}.svg`;
}

function fillIcons(value: IconItem[], total: number): IconItem[] {
	if (value.length === 0 || total <= 0) {
		return [];
	}

	return Array.from({length: total}, (_, index) => value[index % value.length]);
}

function filterIcons(scheme: Scheme): IconItem[] {
	return icons.filter((icon) => {
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
});
