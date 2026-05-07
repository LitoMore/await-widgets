import {Color, Image, Svg, Text, VStack, ZStack} from 'await';

// @panel
const imageUrl = '';
// @panel {type:'menu',items:['auto','image','svg']}
const imageType = 'auto';
// @panel {type:'menu',items:['contain','cover','stretch','tile']}
const displayMode = 'cover';
// @panel {type:'menu',items:['center','top','bottom','left','right','top-left','top-right','bottom-left','bottom-right']}
const imagePosition = 'center';
// @panel {type:'color'}
const backgroundColor = '00000000';
// @panel
const paddingTop = 0;
// @panel
const paddingRight = 0;
// @panel
const paddingBottom = 0;
// @panel
const paddingLeft = 0;

type DisplayMode = 'contain' | 'cover' | 'stretch' | 'tile';
type ImageType = 'auto' | 'image' | 'svg';
type ImagePosition =
	| 'center'
	| 'top'
	| 'bottom'
	| 'left'
	| 'right'
	| 'top-left'
	| 'top-right'
	| 'bottom-left'
	| 'bottom-right';

function widget() {
	const mode = normalizeDisplayMode(displayMode);
	const type = normalizeImageType(imageType);
	const alignment = normalizeImagePosition(imagePosition);
	const padding = normalizePadding({
		top: paddingTop,
		right: paddingRight,
		bottom: paddingBottom,
		left: paddingLeft,
	});

	return (
		<ZStack maxSides alignment={alignment}>
			<Color value={backgroundColor} />
			<ZStack maxSides alignment={alignment} padding={padding}>
				{imageUrl ? (
					renderImage(imageUrl, type, mode, alignment)
				) : (
					<VStack maxSides foreground="secondary" padding={16}>
						<Text
							fontSize={18}
							fontWeight={700}
							minimumScaleFactor={0.7}
							textAlignment="center"
							value="Choose an image"
						/>
						<Text
							fontSize={12}
							minimumScaleFactor={0.7}
							textAlignment="center"
							value="Set imageUrl in the widget panel"
						/>
					</VStack>
				)}
			</ZStack>
		</ZStack>
	);
}

function renderImage(
	url: string,
	type: ImageType,
	mode: DisplayMode,
	alignment: Alignment,
) {
	const aspectRatio =
		mode === 'cover' ? 'fill' : mode === 'contain' ? 'fit' : undefined;
	const frame = {maxWidth: 'max', maxHeight: 'max', alignment};

	if (type === 'svg' || (type === 'auto' && isSvgUrl(url))) {
		return (
			<Svg
				aspectRatio={aspectRatio}
				clipped={mode === 'cover'}
				frame={frame}
				url={url}
			/>
		);
	}

	return (
		<Image
			aspectRatio={aspectRatio}
			clipped={mode === 'cover' || mode === 'tile'}
			frame={frame}
			resizable={mode === 'tile' ? 'tile' : true}
			url={url}
		/>
	);
}

function normalizeImageType(value: string): ImageType {
	if (value === 'auto' || value === 'image' || value === 'svg') {
		return value;
	}

	return 'auto';
}

function normalizePadding(value: {
	top: number;
	right: number;
	bottom: number;
	left: number;
}): Padding {
	return {
		top: normalizePaddingValue(value.top),
		right: normalizePaddingValue(value.right),
		bottom: normalizePaddingValue(value.bottom),
		left: normalizePaddingValue(value.left),
	};
}

function normalizePaddingValue(value: number): number {
	if (Number.isFinite(value)) {
		return Math.max(0, value);
	}

	return 0;
}

function isSvgUrl(value: string): boolean {
	const normalized = value.trim().toLowerCase();
	const path = normalized.replace(/[?#].*$/v, '');

	return (
		normalized.startsWith('data:image/svg+xml') ||
		(normalized.startsWith('data:') && normalized.includes('image/svg+xml')) ||
		path.endsWith('.svg') ||
		path.endsWith('.svgz')
	);
}

function normalizeDisplayMode(value: string): DisplayMode {
	if (
		value === 'contain' ||
		value === 'cover' ||
		value === 'stretch' ||
		value === 'tile'
	) {
		return value;
	}

	return 'cover';
}

function normalizeImagePosition(value: string): Alignment {
	const positions: Record<ImagePosition, Alignment> = {
		center: 'center',
		top: 'top',
		bottom: 'bottom',
		left: 'leading',
		right: 'trailing',
		'top-left': 'topLeading',
		'top-right': 'topTrailing',
		'bottom-left': 'bottomLeading',
		'bottom-right': 'bottomTrailing',
	};
	// eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
	return positions[value as ImagePosition] ?? 'center';
}

Await.define({
	widget,
});
