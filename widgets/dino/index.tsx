import {Color, FullButton, HStack, Svg, Text, ZStack} from 'await';

const gameStoreKey = 'dino.state';
const bestScoreStoreKey = 'dino.bestScore';
const stageWidth = 300;
const stageHeight = 150;
const groundY = 112;
const dinoX = 38;
const dinoWidth = 44;
const dinoHeight = 47;
const obstacleSpacing = 168;
const obstacleLead = 336;
const obstacleSkipRate = 0.38;
const maxStoredTime = 86_400_000;
const timelineFrameInterval = 90;
const collisionScanInterval = 30;
const predictionHorizon = 30_000;
const gameOverHold = 1200;
const dinoRunFrame0 =
	'M24 2h16v1H24zM24 3h16v1H24zM22 4h20v1H22zM22 5h4v1H22zM28 5h14v1H28zM22 6h4v1H22zM28 6h14v1H28zM22 7h20v1H22zM22 8h20v1H22zM22 9h20v1H22zM22 10h20v1H22zM22 11h20v1H22zM22 12h20v1H22zM22 13h10v1H22zM22 14h10v1H22zM22 15h16v1H22zM22 16h16v1H22zM2 17h2v1H2zM20 17h10v1H20zM2 18h2v1H2zM20 18h10v1H20zM2 19h2v1H2zM17 19h13v1H17zM2 20h2v1H2zM17 20h13v1H17zM2 21h4v1H2zM14 21h20v1H14zM2 22h4v1H2zM14 22h20v1H14zM2 23h6v1H2zM12 23h18v1H12zM32 23h2v1H32zM2 24h6v1H2zM12 24h18v1H12zM32 24h2v1H32zM2 25h28v1H2zM2 26h28v1H2zM2 27h28v1H2zM2 28h28v1H2zM4 29h26v1H4zM4 30h24v1H4zM6 31h22v1H6zM6 32h22v1H6zM8 33h18v1H8zM8 34h18v1H8zM10 35h14v1H10zM10 36h14v1H10zM12 37h6v1H12zM22 37h5v1H22zM12 38h6v1H12zM22 38h5v1H22zM12 39h4v1H12zM12 40h4v1H12zM12 41h2v1H12zM12 42h2v1H12zM12 43h4v1H12zM12 44h4v1H12z';
const dinoRunFrame1 =
	'M24 2h16v1H24zM24 3h16v1H24zM22 4h20v1H22zM22 5h4v1H22zM28 5h14v1H28zM22 6h4v1H22zM28 6h14v1H28zM22 7h20v1H22zM22 8h20v1H22zM22 9h20v1H22zM22 10h20v1H22zM22 11h20v1H22zM22 12h20v1H22zM22 13h10v1H22zM22 14h10v1H22zM22 15h16v1H22zM22 16h16v1H22zM2 17h2v1H2zM20 17h10v1H20zM2 18h2v1H2zM20 18h10v1H20zM2 19h2v1H2zM17 19h13v1H17zM2 20h2v1H2zM17 20h13v1H17zM2 21h4v1H2zM14 21h20v1H14zM2 22h4v1H2zM14 22h20v1H14zM2 23h6v1H2zM12 23h18v1H12zM32 23h2v1H32zM2 24h6v1H2zM12 24h18v1H12zM32 24h2v1H32zM2 25h28v1H2zM2 26h28v1H2zM2 27h28v1H2zM2 28h28v1H2zM4 29h26v1H4zM4 30h24v1H4zM6 31h22v1H6zM6 32h22v1H6zM8 33h18v1H8zM8 34h18v1H8zM10 35h14v1H10zM10 36h14v1H10zM12 37h4v1H12zM20 37h4v1H20zM12 38h4v1H12zM20 38h4v1H20zM14 39h4v1H14zM22 39h2v1H22zM14 40h4v1H14zM22 40h2v1H22zM22 41h2v1H22zM22 42h2v1H22zM22 43h4v1H22zM22 44h4v1H22z';
const dinoCrashedFrame =
	'M24 2h16v1H24zM24 3h16v1H24zM22 4h20v1H22zM22 5h4v1H22zM30 5h12v1H30zM22 6h4v1H22zM27 6h2v1H27zM30 6h12v1H30zM22 7h4v1H22zM27 7h2v1H27zM30 7h12v1H30zM22 8h4v1H22zM30 8h12v1H30zM22 9h20v1H22zM22 10h20v1H22zM22 11h20v1H22zM22 12h20v1H22zM22 13h20v1H22zM22 14h20v1H22zM22 15h16v1H22zM22 16h16v1H22zM2 17h2v1H2zM20 17h10v1H20zM2 18h2v1H2zM20 18h10v1H20zM2 19h2v1H2zM17 19h13v1H17zM2 20h2v1H2zM17 20h13v1H17zM2 21h4v1H2zM14 21h20v1H14zM2 22h4v1H2zM14 22h20v1H14zM2 23h6v1H2zM12 23h18v1H12zM32 23h2v1H32zM2 24h6v1H2zM12 24h18v1H12zM32 24h2v1H32zM2 25h28v1H2zM2 26h28v1H2zM2 27h28v1H2zM2 28h28v1H2zM4 29h26v1H4zM4 30h24v1H4zM6 31h22v1H6zM6 32h22v1H6zM8 33h18v1H8zM8 34h18v1H8zM10 35h14v1H10zM10 36h14v1H10zM12 37h6v1H12zM20 37h4v1H20zM12 38h6v1H12zM20 38h4v1H20zM12 39h4v1H12zM22 39h2v1H22zM12 40h4v1H12zM22 40h2v1H22zM12 41h2v1H12zM22 41h2v1H22zM12 42h2v1H12zM22 42h2v1H22zM12 43h4v1H12zM22 43h4v1H22zM12 44h4v1H12zM22 44h4v1H22z';

// @panel {type:'menu',items:['auto','light','dark']}
const colorScheme = 'auto';
// @panel {type:'slider',min:80,max:170,step:5}
const startSpeed = 112;
// @panel {type:'slider',min:0,max:14,step:1}
const speedRamp = 5;
// @panel {type:'slider',min:42,max:80,step:1}
const jumpHeight = 60;
// @panel {type:'slider',min:760,max:1300,step:20}
const jumpDuration = 1000;
// @panel
const showClouds = false;
// @panel
const showScore = true;

type Scheme = 'dark' | 'light';
type GameStatus = 'gameOver' | 'ready' | 'running';
type ObstacleKind = 'cactus' | 'double' | 'small' | 'triple';

type GameRecord = {
	readonly gameOverAt: number;
	readonly jumpStartedAt: number;
	readonly seed: number;
	readonly startedAt: number;
};

type Palette = {
	readonly background: string;
	readonly primary: string;
	readonly secondary: string;
};

type StageLayout = {
	readonly originX: number;
	readonly originY: number;
	readonly scale: number;
	readonly stageHeight: number;
	readonly stageWidth: number;
};

type GameFrame = {
	readonly animationKey: number;
	readonly bestScore: number;
	readonly clouds: CloudFrame[];
	readonly distance: number;
	readonly dinoY: number;
	readonly elapsed: number;
	readonly grounded: boolean;
	readonly legFrame: number;
	readonly obstacles: ObstacleFrame[];
	readonly score: number;
	readonly status: GameStatus;
};

type ObstacleFrame = {
	readonly height: number;
	readonly id: string;
	readonly kind: ObstacleKind;
	readonly width: number;
	readonly x: number;
};

type CloudFrame = {
	readonly id: string;
	readonly width: number;
	readonly x: number;
	readonly y: number;
};

type GroundDash = {
	readonly id: string;
	readonly width: number;
	readonly x: number;
};

function widget(entry: WidgetEntry) {
	const record = readGameRecord();
	const frame = getGameFrame(record, entry.date.getTime());
	const palette = getPalette(colorScheme, entry.colorScheme);
	const layout = getStageLayout(entry.size);

	return (
		<ZStack clipped maxSides>
			<Color value={palette.background} />
			{renderStage(frame, palette, layout, entry.size)}
			{showScore ? renderScore(frame, palette) : undefined}
			{renderStatus(frame, palette)}
			<FullButton fast intent={app.tap()} />
		</ZStack>
	);
}

function renderStage(
	frame: GameFrame,
	palette: Palette,
	layout: StageLayout,
	size: Size,
) {
	const dinoTop = groundY - dinoHeight - frame.dinoY;
	const dinoFrame = frame.status === 'gameOver' ? 0 : frame.legFrame;

	return (
		<ZStack maxSides>
			{showClouds
				? frame.clouds.map((cloud) => {
						const width = scaleValue(cloud.width, layout);
						const height = scaleValue(16, layout);

						return (
							// eslint-disable-next-line react/jsx-key
							<ZStack
								animation={{
									duration: 0.2,
									type: 'linear',
									value: frame.animationKey,
								}}
								frame={{width, height}}
								id={cloud.id}
								offset={getOffset({
									height,
									layout,
									size,
									width,
									x: cloud.x,
									y: cloud.y,
								})}
							>
								<Svg maxSides value={getCloudSvg(palette.secondary)} />
							</ZStack>
						);
					})
				: undefined}
			<Color
				frame={{
					height: Math.max(1, scaleValue(1.5, layout)),
					width: layout.stageWidth,
				}}
				offset={getOffset({
					height: Math.max(1, scaleValue(1.5, layout)),
					layout,
					size,
					width: layout.stageWidth,
					x: 0,
					y: groundY,
				})}
				value={palette.primary}
			/>
			{getGroundDashes(frame.distance).map((dash) => {
				const width = scaleValue(dash.width, layout);
				const height = Math.max(1, scaleValue(1, layout));

				return (
					// eslint-disable-next-line react/jsx-key
					<Color
						animation={{
							duration: 0.2,
							type: 'linear',
							value: frame.animationKey,
						}}
						frame={{width, height}}
						id={dash.id}
						offset={getOffset({
							height,
							layout,
							size,
							width,
							x: dash.x,
							y: groundY + 8,
						})}
						value={palette.secondary}
					/>
				);
			})}
			{frame.obstacles.map((obstacle) => {
				const width = scaleValue(obstacle.width, layout);
				const height = scaleValue(obstacle.height, layout);

				return (
					// eslint-disable-next-line react/jsx-key
					<ZStack
						animation={{
							duration: 0.2,
							type: 'linear',
							value: frame.animationKey,
						}}
						frame={{width, height}}
						id={obstacle.id}
						offset={getOffset({
							height,
							layout,
							size,
							width,
							x: obstacle.x,
							y: groundY - obstacle.height,
						})}
					>
						<Svg
							maxSides
							value={getObstacleSvg(obstacle.kind, palette.primary)}
						/>
					</ZStack>
				);
			})}
			<ZStack
				animation={{
					duration: 0.14,
					type: 'easeOut',
					value: frame.animationKey,
				}}
				frame={{
					height: scaleValue(dinoHeight, layout),
					width: scaleValue(dinoWidth, layout),
				}}
				id="dino"
				offset={getOffset({
					height: scaleValue(dinoHeight, layout),
					layout,
					size,
					width: scaleValue(dinoWidth, layout),
					x: dinoX,
					y: dinoTop,
				})}
			>
				<Svg
					maxSides
					value={getDinoSvg({
						crashed: frame.status === 'gameOver',
						frame: dinoFrame,
						primary: palette.primary,
					})}
				/>
			</ZStack>
		</ZStack>
	);
}

function renderScore(frame: GameFrame, palette: Palette) {
	return (
		<HStack
			frame={{
				alignment: 'topTrailing',
				maxHeight: 'max',
				maxWidth: 'max',
			}}
			padding={{right: 11, top: 8}}
			spacing={7}
		>
			<Text
				monospaced
				fontSize={10}
				fontWeight={700}
				foreground={palette.secondary}
				value={`HI ${formatScore(frame.bestScore)}`}
			/>
			<Text
				monospaced
				fontSize={10}
				fontWeight={700}
				foreground={palette.primary}
				value={formatScore(frame.score)}
			/>
		</HStack>
	);
}

function renderStatus(frame: GameFrame, palette: Palette) {
	if (frame.status === 'running') {
		return;
	}

	const title = frame.status === 'ready' ? 'DINO' : 'GAME OVER';
	const subtitle = frame.status === 'ready' ? 'TAP TO START' : 'TAP TO RESTART';

	return (
		<ZStack
			frame={{
				alignment: 'center',
				maxHeight: 'max',
				maxWidth: 'max',
			}}
			padding={{bottom: 20}}
		>
			<ZStack background={palette.background}>
				<ZStack padding={{horizontal: 10, vertical: 6}}>
					<Text
						monospaced
						fontSize={frame.status === 'ready' ? 21 : 16}
						fontWeight={700}
						foreground={palette.primary}
						textAlignment="center"
						value={title}
					/>
					<Text
						monospaced
						fontSize={8}
						foreground={palette.secondary}
						offset={{y: frame.status === 'ready' ? 20 : 18}}
						textAlignment="center"
						value={subtitle}
					/>
				</ZStack>
			</ZStack>
		</ZStack>
	);
}

function tap(): void {
	const now = Date.now();
	const record = readGameRecord();
	const frame = getGameFrame(record, now);

	if (frame.status !== 'running') {
		persistBestScore(frame.score);
		AwaitStore.set(gameStoreKey, createGameRecord(now));
		AwaitUI.haptic('selection');
		return;
	}

	if (!frame.grounded) {
		return;
	}

	AwaitStore.set(gameStoreKey, {
		...record,
		gameOverAt: 0,
		jumpStartedAt: now,
	});
	AwaitUI.haptic('impact');
}

function widgetTimeline(): Timeline {
	const now = Date.now();
	const record = readGameRecord();
	const frame = getGameFrame(record, now);

	if (frame.status === 'gameOver' && record.startedAt > 0) {
		persistBestScore(frame.score);
		if (record.gameOverAt === 0 || record.gameOverAt > now) {
			AwaitStore.set(gameStoreKey, {
				...record,
				gameOverAt: now,
			});
		}

		return {
			entries: [{date: new Date(now)}],
			update: 'never',
		};
	}

	if (frame.status !== 'running') {
		return {
			entries: [{date: new Date(now)}],
			update: 'never',
		};
	}

	const gameOverAt = predictGameOverAt(record, now);
	if (gameOverAt !== record.gameOverAt) {
		AwaitStore.set(gameStoreKey, {
			...record,
			gameOverAt,
		});
	}

	return {
		entries: getTimelineDates(now, gameOverAt + gameOverHold).map((date) => ({
			date,
		})),
		update: 'never',
	};
}

function readGameRecord(): GameRecord {
	const record = AwaitStore.get<GameRecord>(gameStoreKey);
	if (!record) {
		return createIdleRecord();
	}

	const startedAt = normalizeStoreTime(record.startedAt);
	const jumpStartedAt = normalizeStoreTime(record.jumpStartedAt);
	const gameOverAt = normalizeStoreTime(record.gameOverAt);
	const seed = normalizePositive(record.seed, 1);

	if (startedAt === 0) {
		return createIdleRecord();
	}

	return {
		gameOverAt,
		jumpStartedAt,
		seed,
		startedAt,
	};
}

function createIdleRecord(): GameRecord {
	return {
		gameOverAt: 0,
		jumpStartedAt: 0,
		seed: 1,
		startedAt: 0,
	};
}

function createGameRecord(now: number): GameRecord {
	return {
		gameOverAt: 0,
		jumpStartedAt: 0,
		seed: Math.max(1, Math.floor(now % 2_147_483_647)),
		startedAt: now,
	};
}

function getGameFrame(record: GameRecord, now: number): GameFrame {
	if (record.startedAt === 0) {
		return getReadyFrame(now);
	}

	const hasScheduledGameOver =
		record.gameOverAt > record.startedAt && now >= record.gameOverAt;
	const frameTime = hasScheduledGameOver ? record.gameOverAt : now;
	const elapsed = Math.max(0, frameTime - record.startedAt);
	const distance = getDistance(elapsed);
	const dinoY = getDinoY(record.jumpStartedAt, record.startedAt, frameTime);
	const obstacles = getObstacles(distance, record.seed);
	const score = Math.max(0, Math.floor(distance / 10));
	const collided = hasScheduledGameOver || hasCollision(dinoY, obstacles);
	const status = collided ? 'gameOver' : 'running';
	const bestScore = Math.max(AwaitStore.num(bestScoreStoreKey, 0), score);

	return {
		animationKey: Math.floor(now / 100),
		bestScore,
		clouds: getClouds(distance, record.seed),
		distance,
		dinoY,
		elapsed,
		grounded: dinoY <= 0,
		legFrame: Math.floor(elapsed / 120) % 2,
		obstacles,
		score,
		status,
	};
}

function getReadyFrame(now: number): GameFrame {
	const bestScore = AwaitStore.num(bestScoreStoreKey, 0);

	return {
		animationKey: Math.floor(now / 100),
		bestScore,
		clouds: getClouds(0, 1),
		distance: 0,
		dinoY: 0,
		elapsed: 0,
		grounded: true,
		legFrame: 0,
		obstacles: getObstacles(0, 1),
		score: 0,
		status: 'ready',
	};
}

function getDinoY(
	jumpStartedAt: number,
	startedAt: number,
	now: number,
): number {
	if (jumpStartedAt <= startedAt) {
		return 0;
	}

	const elapsed = now - jumpStartedAt;
	const duration = normalizePanelNumber(jumpDuration, 980, 760, 1300);
	if (elapsed <= 0 || elapsed >= duration) {
		return 0;
	}

	const progress = elapsed / duration;
	return (
		Math.sin(progress * Math.PI) * normalizePanelNumber(jumpHeight, 60, 42, 80)
	);
}

function getDistance(elapsed: number): number {
	const seconds = elapsed / 1000;
	const speed = normalizePanelNumber(startSpeed, 112, 80, 170);
	const ramp = normalizePanelNumber(speedRamp, 5, 0, 14);

	return speed * seconds + (ramp * seconds * seconds) / 2;
}

function predictGameOverAt(record: GameRecord, now: number): number {
	const endAt = now + predictionHorizon;

	for (let time = now; time <= endAt; time += collisionScanInterval) {
		const elapsed = Math.max(0, time - record.startedAt);
		const distance = getDistance(elapsed);
		const dinoY = getDinoY(record.jumpStartedAt, record.startedAt, time);

		if (hasCollision(dinoY, getObstacles(distance, record.seed))) {
			return time;
		}
	}

	return endAt;
}

function getTimelineDates(startAt: number, endAt: number): Date[] {
	const dates: Date[] = [];

	for (let time = startAt; time <= endAt; time += timelineFrameInterval) {
		dates.push(new Date(time));
	}

	const finalDate = dates.at(-1);
	if (!finalDate || finalDate.getTime() < endAt) {
		dates.push(new Date(endAt));
	}

	return dates;
}

function getObstacles(distance: number, seed: number): ObstacleFrame[] {
	const firstOrder = Math.max(
		0,
		Math.floor((distance - obstacleLead - 60) / obstacleSpacing),
	);
	const lastOrder = Math.ceil(
		(distance + stageWidth + 40 - obstacleLead) / obstacleSpacing,
	);
	const obstacles: ObstacleFrame[] = [];

	for (let order = firstOrder; order <= lastOrder; order++) {
		if (order > 0 && seededFraction(seed + order * 41) < obstacleSkipRate) {
			continue;
		}

		const variant = getObstacleVariant(seed, order);
		const x = obstacleLead + order * obstacleSpacing - distance;
		if (x > stageWidth + 40 || x < -variant.width - 20) {
			continue;
		}

		obstacles.push({
			height: variant.height,
			id: `obstacle-${order}`,
			kind: variant.kind,
			width: variant.width,
			x,
		});
	}

	return obstacles;
}

function getObstacleVariant(
	seed: number,
	order: number,
): {height: number; kind: ObstacleKind; width: number} {
	const roll = seededFraction(seed + order * 73);

	if (roll < 0.22) {
		return {height: 27, kind: 'small', width: 14};
	}

	if (roll < 0.5) {
		return {height: 34, kind: 'cactus', width: 18};
	}

	if (roll < 0.76) {
		return {height: 36, kind: 'double', width: 29};
	}

	return {height: 38, kind: 'triple', width: 39};
}

function getClouds(distance: number, seed: number): CloudFrame[] {
	return Array.from({length: 4}, (_, index) => {
		const order = Math.floor(distance / 62) + index;
		const width = 34 + Math.floor(seededFraction(seed + order * 17) * 12);
		const x = stageWidth + 40 + index * 88 - ((distance * 0.32) % 88);
		const y = 18 + seededFraction(seed + order * 29) * 28;

		return {
			id: `cloud-${order}`,
			width,
			x,
			y,
		};
	});
}

function getGroundDashes(distance: number): GroundDash[] {
	const dashes: GroundDash[] = [];
	const dashSpacing = 44;
	const offset = distance % dashSpacing;

	for (let index = 0; index < 9; index++) {
		const order = Math.floor(distance / dashSpacing) + index;
		const width = 7 + Math.floor(seededFraction(order * 19) * 18);
		const x = index * dashSpacing - offset;

		if (x < -width || x > stageWidth) {
			continue;
		}

		dashes.push({
			id: `ground-${order}`,
			width,
			x,
		});
	}

	return dashes;
}

function hasCollision(dinoY: number, obstacles: ObstacleFrame[]): boolean {
	const dinoBox = {
		height: dinoHeight - 9,
		width: dinoWidth - 14,
		x: dinoX + 8,
		y: groundY - dinoHeight - dinoY + 5,
	};

	return obstacles.some((obstacle) => {
		const obstacleBox = {
			height: obstacle.height - 3,
			width: obstacle.width - 5,
			x: obstacle.x + 3,
			y: groundY - obstacle.height + 2,
		};

		return boxesOverlap(dinoBox, obstacleBox);
	});
}

function boxesOverlap(
	first: {height: number; width: number; x: number; y: number},
	second: {height: number; width: number; x: number; y: number},
): boolean {
	return (
		first.x < second.x + second.width &&
		first.x + first.width > second.x &&
		first.y < second.y + second.height &&
		first.y + first.height > second.y
	);
}

function getStageLayout(size: Size): StageLayout {
	const scale = Math.min(size.width / stageWidth, size.height / stageHeight);
	const renderedWidth = stageWidth * scale;
	const renderedHeight = stageHeight * scale;

	return {
		originX: (size.width - renderedWidth) / 2,
		originY: (size.height - renderedHeight) / 2,
		scale,
		stageHeight: renderedHeight,
		stageWidth: renderedWidth,
	};
}

function getOffset(options: {
	height: number;
	layout: StageLayout;
	size: Size;
	width: number;
	x: number;
	y: number;
}): {x: number; y: number} {
	return {
		x:
			options.layout.originX +
			options.x * options.layout.scale +
			options.width / 2 -
			options.size.width / 2,
		y:
			options.layout.originY +
			options.y * options.layout.scale +
			options.height / 2 -
			options.size.height / 2,
	};
}

function scaleValue(value: number, layout: StageLayout): number {
	return value * layout.scale;
}

function getPalette(value: string, fallback: ColorScheme): Palette {
	const scheme = normalizeScheme(value, fallback);

	if (scheme === 'dark') {
		return {
			background: '151515',
			primary: 'E7E7E7',
			secondary: '9A9A9A',
		};
	}

	return {
		background: 'F7F7F7',
		primary: '555555',
		secondary: '909090',
	};
}

function getDinoSvg(options: {
	crashed: boolean;
	frame: number;
	primary: string;
}): string {
	const primary = svgColor(options.primary);
	const path = options.crashed
		? dinoCrashedFrame
		: options.frame === 0
			? dinoRunFrame0
			: dinoRunFrame1;

	return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 44 47" shape-rendering="crispEdges"><path fill="${primary}" d="${path}"/></svg>`;
}

function getObstacleSvg(kind: ObstacleKind, color: string): string {
	const fill = svgColor(color);

	if (kind === 'small') {
		return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 27" shape-rendering="crispEdges"><path fill="${fill}" d="M5 4h5v23H5zM0 12h5v5H0zM9 9h5v5H9zM2 17h3v4H2zM11 14h3v4h-3zM6 0h3v5H6z"/></svg>`;
	}

	if (kind === 'double') {
		return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 29 36" shape-rendering="crispEdges"><path fill="${fill}" d="M4 7h6v29H4zM0 16h4v7H0zM9 12h5v6H9zM1 23h3v5H1zM12 18h2v5h-2zM6 0h3v8H6zM20 3h5v33h-5zM15 13h5v7h-5zM24 16h5v7h-5zM17 20h3v5h-3zM26 23h3v5h-3zM21 0h3v5h-3z"/></svg>`;
	}

	if (kind === 'triple') {
		return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 39 38" shape-rendering="crispEdges"><path fill="${fill}" d="M2 11h6v27H2zM0 20h3v7H0zM7 15h5v7H7zM10 22h2v5h-2zM4 5h3v7H4zM16 4h7v34h-7zM12 16h4v8h-4zM22 11h5v7h-5zM13 24h3v5h-3zM25 18h2v5h-2zM18 0h3v6h-3zM31 9h5v29h-5zM27 18h4v7h-4zM35 15h4v7h-4zM28 25h3v5h-3zM37 22h2v5h-2zM32 4h3v6h-3z"/></svg>`;
	}

	return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 34" shape-rendering="crispEdges"><path fill="${fill}" d="M7 6h6v28H7zM0 15h7v7H0zM12 11h6v7h-6zM3 22h4v5H3zM15 18h3v5h-3zM8 0h4v7H8z"/></svg>`;
}

function getCloudSvg(color: string): string {
	const stroke = svgColor(color);

	return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 44 16" fill="none" stroke="${stroke}" stroke-linecap="square" stroke-linejoin="miter" stroke-width="2"><path d="M1 11h9V7h5V4h7v3h5v4h16"/></svg>`;
}

function svgColor(value: string): string {
	if (value.startsWith('#')) {
		return value;
	}

	return `#${value}`;
}

function persistBestScore(score: number): void {
	if (score > AwaitStore.num(bestScoreStoreKey, 0)) {
		AwaitStore.set(bestScoreStoreKey, score);
	}
}

function formatScore(value: number): string {
	return Math.max(0, value).toString().padStart(5, '0').slice(-5);
}

function seededFraction(seed: number): number {
	const value = Math.sin(seed * 12.9898) * 43_758.5453;
	return value - Math.floor(value);
}

function normalizeScheme(value: string, fallback: ColorScheme): Scheme {
	if (value === 'light' || value === 'dark') {
		return value;
	}

	return fallback === 'dark' ? 'dark' : 'light';
}

function normalizePanelNumber(
	value: number,
	fallback: number,
	minimum: number,
	maximum: number,
): number {
	if (!Number.isFinite(value)) {
		return fallback;
	}

	return Math.min(maximum, Math.max(minimum, value));
}

function normalizePositive(value: number, fallback: number): number {
	if (Number.isFinite(value) && value > 0) {
		return Math.floor(value);
	}

	return fallback;
}

function normalizeStoreTime(value: number): number {
	if (!Number.isFinite(value) || value < 0) {
		return 0;
	}

	const now = Date.now();
	if (value > now + maxStoredTime || value < now - maxStoredTime) {
		return 0;
	}

	return Math.floor(value);
}

const app = Await.define({
	widget,
	widgetIntents: {tap},
	widgetTimeline,
});
