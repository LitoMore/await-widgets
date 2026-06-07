import {Color, HStack, RoundedRectangle, Text, ZStack} from 'await';

const backgroundColor = '007aff';
// @panel {type:'slider',min:0,max:96,step:1}
const backgroundCornerRadius = 96;

const foregroundColor = 'white';
const borderColor: [string, number] = ['white', 0.45];
const edgePadding = 6;
const cornerInsetRatio = 0.3;

type ValueOptions = {
	readonly alignment: Alignment;
	readonly label: string;
	readonly padding: Padding;
	readonly size: Size;
	readonly value: string;
};

function widget(entry: WidgetEntry) {
	const width = formatDimension(entry.size.width);
	const height = formatDimension(entry.size.height);
	const radius = normalizeRadius(backgroundCornerRadius);
	const cornerPadding = getCornerPadding(radius, entry.size);

	return (
		<ZStack maxSides>
			<Color maxSides value="white" />
			<Color
				maxSides
				clipShape={<RoundedRectangle rectRadius={radius} style="continuous" />}
				value={backgroundColor}
			/>
			<RoundedRectangle
				maxSides
				rectRadius={radius}
				stroke={{color: borderColor, lineWidth: 1}}
				style="continuous"
				fill=""
			/>
			{renderValue({
				label: 'W',
				value: width,
				size: entry.size,
				alignment: 'top',
				padding: {top: edgePadding},
			})}
			{renderValue({
				label: 'H',
				value: height,
				size: entry.size,
				alignment: 'leading',
				padding: {left: edgePadding},
			})}
			{renderValue({
				label: 'R',
				value: formatDimension(radius),
				size: entry.size,
				alignment: 'bottomTrailing',
				padding: {right: cornerPadding, bottom: cornerPadding},
			})}
		</ZStack>
	);
}

function renderValue(options: ValueOptions) {
	const {alignment, label, padding, size, value} = options;

	return (
		<HStack
			alignment="center"
			foreground={foregroundColor}
			padding={padding}
			frame={{width: size.width, height: size.height, alignment}}
			spacing={3}
		>
			<Text
				fontSize={11}
				fontWeight={700}
				lineLimit={1}
				minimumScaleFactor={0.7}
				opacity={0.72}
				value={label}
			/>
			<Text
				fontDesign="monospaced"
				fontSize={14}
				fontWeight={700}
				lineLimit={1}
				minimumScaleFactor={0.65}
				monospacedDigit
				value={value}
			/>
		</HStack>
	);
}

function formatDimension(value: number): string {
	if (!Number.isFinite(value)) {
		return '0';
	}

	if (Number.isInteger(value)) {
		return String(value);
	}

	return value.toFixed(1);
}

function normalizeRadius(value: number): number {
	if (!Number.isFinite(value)) {
		return 0;
	}

	return Math.max(0, value);
}

function getCornerPadding(radius: number, size: Size): number {
	const effectiveRadius = Math.min(radius, size.width / 2, size.height / 2);

	return edgePadding + Math.ceil(effectiveRadius * cornerInsetRatio);
}

Await.define({
	widget,
});
