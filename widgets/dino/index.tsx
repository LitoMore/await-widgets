import {Button, Color, HStack, Modifier, Svg, Text, ZStack} from 'await';

const gameStoreKey = 'dino.state';
const bestScoreStoreKey = 'dino.bestScore';
const ttlStoreKey = 'dino.ttl';
const stageWidth = 600;
const stageHeight = 150;
const groundY = 140;
const dinoX = 50;
const dinoWidth = 44;
const dinoHeight = 47;
const chromeCanvasWidth = 600;
const chromeFps = 60;
const chromeMsPerFrame = 1000 / chromeFps;
const chromeInitialSpeed = 6;
const chromeMaxSpeed = 12;
const chromeAcceleration = 0.001;
const chromeClearTime = 3000;
const chromeGapCoefficient = 0.6;
const chromeGravity = 0.6;
const chromeInitialJumpVelocity = -10;
const chromeMaxJumpY = 30;
const chromeMaxGapCoefficient = 1.5;
const chromeObstacleMinGap = 120;
const runFrameDuration = 1000 / 12;
const widgetMotionFrameInterval = 500;
const widgetJumpFrameInterval = runFrameDuration;
const chromeJumpDuration =
	(-2 * chromeInitialJumpVelocity * chromeMsPerFrame) / chromeGravity;
const maxStoredTime = 86_400_000;
const collisionScanInterval = 30;
const predictionHorizon = 30_000;
const gameOverHold = 1200;
const dinoRunFrame0 =
	'M24 2h16v1H24zM24 3h16v1H24zM22 4h20v1H22zM22 5h4v1H22zM28 5h14v1H28zM22 6h4v1H22zM28 6h14v1H28zM22 7h20v1H22zM22 8h20v1H22zM22 9h20v1H22zM22 10h20v1H22zM22 11h20v1H22zM22 12h20v1H22zM22 13h10v1H22zM22 14h10v1H22zM22 15h16v1H22zM22 16h16v1H22zM2 17h2v1H2zM20 17h10v1H20zM2 18h2v1H2zM20 18h10v1H20zM2 19h2v1H2zM17 19h13v1H17zM2 20h2v1H2zM17 20h13v1H17zM2 21h4v1H2zM14 21h20v1H14zM2 22h4v1H2zM14 22h20v1H14zM2 23h6v1H2zM12 23h18v1H12zM32 23h2v1H32zM2 24h6v1H2zM12 24h18v1H12zM32 24h2v1H32zM2 25h28v1H2zM2 26h28v1H2zM2 27h28v1H2zM2 28h28v1H2zM4 29h26v1H4zM4 30h24v1H4zM6 31h22v1H6zM6 32h22v1H6zM8 33h18v1H8zM8 34h18v1H8zM10 35h14v1H10zM10 36h14v1H10zM12 37h6v1H12zM22 37h5v1H22zM12 38h6v1H12zM22 38h5v1H22zM12 39h4v1H12zM12 40h4v1H12zM12 41h2v1H12zM12 42h2v1H12zM12 43h4v1H12zM12 44h4v1H12z';
const dinoRunFrame1 =
	'M24 2h16v1H24zM24 3h16v1H24zM22 4h20v1H22zM22 5h4v1H22zM28 5h14v1H28zM22 6h4v1H22zM28 6h14v1H28zM22 7h20v1H22zM22 8h20v1H22zM22 9h20v1H22zM22 10h20v1H22zM22 11h20v1H22zM22 12h20v1H22zM22 13h10v1H22zM22 14h10v1H22zM22 15h16v1H22zM22 16h16v1H22zM2 17h2v1H2zM20 17h10v1H20zM2 18h2v1H2zM20 18h10v1H20zM2 19h2v1H2zM17 19h13v1H17zM2 20h2v1H2zM17 20h13v1H17zM2 21h4v1H2zM14 21h20v1H14zM2 22h4v1H2zM14 22h20v1H14zM2 23h6v1H2zM12 23h18v1H12zM32 23h2v1H32zM2 24h6v1H2zM12 24h18v1H12zM32 24h2v1H32zM2 25h28v1H2zM2 26h28v1H2zM2 27h28v1H2zM2 28h28v1H2zM4 29h26v1H4zM4 30h24v1H4zM6 31h22v1H6zM6 32h22v1H6zM8 33h18v1H8zM8 34h18v1H8zM10 35h14v1H10zM10 36h14v1H10zM12 37h4v1H12zM20 37h4v1H20zM12 38h4v1H12zM20 38h4v1H20zM14 39h4v1H14zM22 39h2v1H22zM14 40h4v1H14zM22 40h2v1H22zM22 41h2v1H22zM22 42h2v1H22zM22 43h4v1H22zM22 44h4v1H22z';
const dinoCrashedFrame =
	'M24 2h16v1H24zM24 3h16v1H24zM22 4h20v1H22zM22 5h4v1H22zM30 5h12v1H30zM22 6h4v1H22zM27 6h2v1H27zM30 6h12v1H30zM22 7h4v1H22zM27 7h2v1H27zM30 7h12v1H30zM22 8h4v1H22zM30 8h12v1H30zM22 9h20v1H22zM22 10h20v1H22zM22 11h20v1H22zM22 12h20v1H22zM22 13h20v1H22zM22 14h20v1H22zM22 15h16v1H22zM22 16h16v1H22zM2 17h2v1H2zM20 17h10v1H20zM2 18h2v1H2zM20 18h10v1H20zM2 19h2v1H2zM17 19h13v1H17zM2 20h2v1H2zM17 20h13v1H17zM2 21h4v1H2zM14 21h20v1H14zM2 22h4v1H2zM14 22h20v1H14zM2 23h6v1H2zM12 23h18v1H12zM32 23h2v1H32zM2 24h6v1H2zM12 24h18v1H12zM32 24h2v1H32zM2 25h28v1H2zM2 26h28v1H2zM2 27h28v1H2zM2 28h28v1H2zM4 29h26v1H4zM4 30h24v1H4zM6 31h22v1H6zM6 32h22v1H6zM8 33h18v1H8zM8 34h18v1H8zM10 35h14v1H10zM10 36h14v1H10zM12 37h6v1H12zM20 37h4v1H20zM12 38h6v1H12zM20 38h4v1H20zM12 39h4v1H12zM22 39h2v1H22zM12 40h4v1H12zM22 40h2v1H22zM12 41h2v1H12zM22 41h2v1H22zM12 42h2v1H12zM22 42h2v1H22zM12 43h4v1H12zM22 43h4v1H22zM12 44h4v1H12zM22 44h4v1H22z';
const smallCactusFrame1 =
	'M7 1h3v1H7zM6 2h5v1H6zM6 3h5v1H6zM6 4h5v1H6zM6 5h5v1H6zM14 5h1v1H14zM6 6h5v1H6zM13 6h3v1H13zM6 7h5v1H6zM13 7h3v1H13zM6 8h5v1H6zM13 8h3v1H13zM2 9h1v1H2zM6 9h5v1H6zM13 9h3v1H13zM1 10h3v1H1zM6 10h5v1H6zM13 10h3v1H13zM1 11h3v1H1zM6 11h5v1H6zM13 11h3v1H13zM1 12h3v1H1zM6 12h5v1H6zM13 12h3v1H13zM1 13h3v1H1zM6 13h5v1H6zM13 13h3v1H13zM1 14h3v1H1zM6 14h5v1H6zM13 14h3v1H13zM1 15h3v1H1zM6 15h5v1H6zM13 15h3v1H13zM1 16h3v1H1zM6 16h10v1H6zM1 17h3v1H1zM6 17h9v1H6zM1 18h3v1H1zM6 18h8v1H6zM1 19h3v1H1zM6 19h5v1H6zM1 20h10v1H1zM2 21h9v1H2zM3 22h8v1H3zM6 23h5v1H6zM6 24h5v1H6zM6 25h5v1H6zM6 26h5v1H6zM6 27h5v1H6zM6 28h5v1H6zM6 29h5v1H6zM6 30h5v1H6zM6 31h5v1H6zM6 32h5v1H6zM6 33h5v1H6z';
const smallCactusFrame2 =
	'M7 1h3v1H7zM24 1h3v1H24zM6 2h5v1H6zM23 2h5v1H23zM6 3h5v1H6zM23 3h5v1H23zM6 4h5v1H6zM23 4h5v1H23zM6 5h5v1H6zM14 5h1v1H14zM19 5h2v1H19zM23 5h5v1H23zM31 5h1v1H31zM6 6h5v1H6zM13 6h3v1H13zM18 6h4v1H18zM23 6h5v1H23zM30 6h3v1H30zM6 7h5v1H6zM13 7h3v1H13zM18 7h4v1H18zM23 7h5v1H23zM30 7h3v1H30zM6 8h5v1H6zM13 8h3v1H13zM18 8h4v1H18zM23 8h5v1H23zM30 8h3v1H30zM2 9h1v1H2zM6 9h5v1H6zM13 9h3v1H13zM18 9h4v1H18zM23 9h5v1H23zM30 9h3v1H30zM1 10h3v1H1zM6 10h5v1H6zM13 10h3v1H13zM18 10h4v1H18zM23 10h5v1H23zM30 10h3v1H30zM1 11h3v1H1zM6 11h5v1H6zM13 11h3v1H13zM18 11h4v1H18zM23 11h5v1H23zM30 11h3v1H30zM1 12h3v1H1zM6 12h5v1H6zM13 12h3v1H13zM18 12h4v1H18zM23 12h5v1H23zM30 12h3v1H30zM1 13h3v1H1zM6 13h5v1H6zM13 13h3v1H13zM18 13h10v1H18zM30 13h3v1H30zM1 14h3v1H1zM6 14h5v1H6zM13 14h3v1H13zM18 14h10v1H18zM30 14h3v1H30zM1 15h3v1H1zM6 15h5v1H6zM13 15h3v1H13zM19 15h9v1H19zM30 15h3v1H30zM1 16h3v1H1zM6 16h10v1H6zM20 16h8v1H20zM30 16h3v1H30zM1 17h3v1H1zM6 17h9v1H6zM23 17h5v1H23zM30 17h3v1H30zM1 18h3v1H1zM6 18h8v1H6zM23 18h10v1H23zM1 19h3v1H1zM6 19h5v1H6zM23 19h9v1H23zM1 20h10v1H1zM23 20h8v1H23zM2 21h9v1H2zM23 21h5v1H23zM3 22h8v1H3zM23 22h5v1H23zM6 23h5v1H6zM23 23h5v1H23zM6 24h5v1H6zM23 24h5v1H23zM6 25h5v1H6zM23 25h5v1H23zM6 26h5v1H6zM23 26h5v1H23zM6 27h5v1H6zM23 27h5v1H23zM6 28h5v1H6zM23 28h5v1H23zM6 29h5v1H6zM23 29h5v1H23zM6 30h5v1H6zM23 30h5v1H23zM6 31h5v1H6zM23 31h5v1H23zM6 32h5v1H6zM23 32h5v1H23zM6 33h5v1H6zM23 33h5v1H23z';
const smallCactusFrame3 =
	'M7 1h3v1H7zM24 1h3v1H24zM41 1h3v1H41zM6 2h5v1H6zM23 2h5v1H23zM40 2h5v1H40zM6 3h5v1H6zM23 3h5v1H23zM40 3h5v1H40zM6 4h5v1H6zM19 4h1v1H19zM23 4h5v1H23zM36 4h1v1H36zM40 4h5v1H40zM6 5h5v1H6zM14 5h1v1H14zM18 5h3v1H18zM23 5h5v1H23zM35 5h3v1H35zM40 5h5v1H40zM48 5h1v1H48zM6 6h5v1H6zM13 6h3v1H13zM18 6h3v1H18zM23 6h5v1H23zM35 6h3v1H35zM40 6h5v1H40zM47 6h3v1H47zM6 7h5v1H6zM13 7h3v1H13zM18 7h3v1H18zM23 7h5v1H23zM35 7h3v1H35zM40 7h5v1H40zM47 7h3v1H47zM6 8h5v1H6zM13 8h3v1H13zM18 8h3v1H18zM23 8h5v1H23zM31 8h1v1H31zM35 8h3v1H35zM40 8h5v1H40zM47 8h3v1H47zM2 9h1v1H2zM6 9h5v1H6zM13 9h3v1H13zM18 9h3v1H18zM23 9h5v1H23zM30 9h3v1H30zM35 9h3v1H35zM40 9h5v1H40zM47 9h3v1H47zM1 10h3v1H1zM6 10h5v1H6zM13 10h3v1H13zM18 10h3v1H18zM23 10h5v1H23zM30 10h3v1H30zM35 10h3v1H35zM40 10h5v1H40zM47 10h3v1H47zM1 11h3v1H1zM6 11h5v1H6zM13 11h3v1H13zM18 11h3v1H18zM23 11h5v1H23zM30 11h3v1H30zM35 11h3v1H35zM40 11h5v1H40zM47 11h3v1H47zM1 12h3v1H1zM6 12h5v1H6zM13 12h3v1H13zM18 12h3v1H18zM23 12h5v1H23zM30 12h3v1H30zM35 12h3v1H35zM40 12h5v1H40zM47 12h3v1H47zM1 13h3v1H1zM6 13h5v1H6zM13 13h3v1H13zM18 13h3v1H18zM23 13h5v1H23zM30 13h3v1H30zM35 13h3v1H35zM40 13h5v1H40zM47 13h3v1H47zM1 14h3v1H1zM6 14h5v1H6zM13 14h3v1H13zM18 14h3v1H18zM23 14h5v1H23zM30 14h3v1H30zM35 14h3v1H35zM40 14h5v1H40zM47 14h3v1H47zM1 15h3v1H1zM6 15h5v1H6zM13 15h3v1H13zM18 15h3v1H18zM23 15h5v1H23zM30 15h3v1H30zM35 15h3v1H35zM40 15h5v1H40zM47 15h3v1H47zM1 16h3v1H1zM6 16h10v1H6zM18 16h3v1H18zM23 16h5v1H23zM30 16h3v1H30zM35 16h10v1H35zM47 16h3v1H47zM1 17h3v1H1zM6 17h9v1H6zM18 17h3v1H18zM23 17h5v1H23zM30 17h3v1H30zM36 17h9v1H36zM47 17h3v1H47zM1 18h3v1H1zM6 18h8v1H6zM18 18h3v1H18zM23 18h5v1H23zM30 18h3v1H30zM37 18h13v1H37zM1 19h3v1H1zM6 19h5v1H6zM18 19h3v1H18zM23 19h5v1H23zM30 19h3v1H30zM40 19h9v1H40zM1 20h10v1H1zM18 20h3v1H18zM23 20h5v1H23zM30 20h3v1H30zM40 20h8v1H40zM2 21h9v1H2zM19 21h9v1H19zM30 21h3v1H30zM40 21h5v1H40zM3 22h8v1H3zM20 22h8v1H20zM30 22h3v1H30zM40 22h5v1H40zM6 23h5v1H6zM21 23h12v1H21zM40 23h5v1H40zM6 24h5v1H6zM23 24h9v1H23zM40 24h5v1H40zM6 25h5v1H6zM23 25h8v1H23zM40 25h5v1H40zM6 26h5v1H6zM23 26h5v1H23zM40 26h5v1H40zM6 27h5v1H6zM23 27h5v1H23zM40 27h5v1H40zM6 28h5v1H6zM23 28h5v1H23zM40 28h5v1H40zM6 29h5v1H6zM23 29h5v1H23zM40 29h5v1H40zM6 30h5v1H6zM23 30h5v1H23zM40 30h5v1H40zM6 31h5v1H6zM23 31h5v1H23zM40 31h5v1H40zM6 32h5v1H6zM23 32h5v1H23zM40 32h5v1H40zM6 33h5v1H6zM23 33h5v1H23zM40 33h5v1H40z';
const largeCactusFrame1 =
	'M10 1h5v1H10zM9 2h7v1H9zM9 3h7v1H9zM9 4h7v1H9zM9 5h7v1H9zM9 6h7v1H9zM9 7h7v1H9zM9 8h7v1H9zM9 9h7v1H9zM9 10h7v1H9zM9 11h7v1H9zM20 11h3v1H20zM9 12h7v1H9zM19 12h5v1H19zM2 13h3v1H2zM9 13h7v1H9zM19 13h5v1H19zM1 14h5v1H1zM9 14h7v1H9zM19 14h5v1H19zM1 15h5v1H1zM9 15h7v1H9zM19 15h5v1H19zM1 16h5v1H1zM9 16h7v1H9zM19 16h5v1H19zM1 17h5v1H1zM9 17h7v1H9zM19 17h5v1H19zM1 18h5v1H1zM9 18h7v1H9zM19 18h5v1H19zM1 19h5v1H1zM9 19h7v1H9zM19 19h5v1H19zM1 20h5v1H1zM9 20h7v1H9zM19 20h5v1H19zM1 21h5v1H1zM9 21h7v1H9zM19 21h5v1H19zM1 22h5v1H1zM9 22h7v1H9zM19 22h5v1H19zM1 23h5v1H1zM9 23h7v1H9zM19 23h5v1H19zM1 24h5v1H1zM9 24h7v1H9zM19 24h5v1H19zM1 25h5v1H1zM9 25h7v1H9zM19 25h5v1H19zM1 26h5v1H1zM9 26h7v1H9zM19 26h5v1H19zM1 27h22v1H1zM1 28h21v1H1zM2 29h19v1H2zM3 30h17v1H3zM4 31h12v1H4zM9 32h7v1H9zM9 33h7v1H9zM9 34h7v1H9zM9 35h7v1H9zM9 36h7v1H9zM9 37h7v1H9zM9 38h7v1H9zM9 39h7v1H9zM9 40h7v1H9zM9 41h7v1H9zM9 42h7v1H9zM9 43h7v1H9zM9 44h7v1H9zM9 45h7v1H9zM19 45h1v1H19zM5 46h1v1H5zM7 46h9v1H7zM16 48h1v1H16z';
const largeCactusFrame2 =
	'M10 1h5v1H10zM35 1h5v1H35zM9 2h7v1H9zM34 2h7v1H34zM9 3h7v1H9zM34 3h7v1H34zM9 4h7v1H9zM34 4h7v1H34zM9 5h7v1H9zM34 5h7v1H34zM9 6h7v1H9zM27 6h3v1H27zM34 6h7v1H34zM9 7h7v1H9zM26 7h5v1H26zM34 7h7v1H34zM9 8h7v1H9zM26 8h5v1H26zM34 8h7v1H34zM9 9h7v1H9zM26 9h5v1H26zM34 9h7v1H34zM9 10h7v1H9zM26 10h5v1H26zM34 10h7v1H34zM9 11h7v1H9zM20 11h2v1H20zM26 11h5v1H26zM34 11h7v1H34zM45 11h3v1H45zM9 12h7v1H9zM19 12h4v1H19zM26 12h5v1H26zM34 12h7v1H34zM44 12h5v1H44zM2 13h3v1H2zM9 13h7v1H9zM19 13h4v1H19zM26 13h5v1H26zM34 13h7v1H34zM44 13h5v1H44zM1 14h5v1H1zM9 14h7v1H9zM19 14h4v1H19zM26 14h5v1H26zM34 14h7v1H34zM44 14h5v1H44zM1 15h5v1H1zM9 15h7v1H9zM19 15h4v1H19zM26 15h5v1H26zM34 15h7v1H34zM44 15h5v1H44zM1 16h5v1H1zM9 16h7v1H9zM19 16h4v1H19zM26 16h5v1H26zM34 16h7v1H34zM44 16h5v1H44zM1 17h5v1H1zM9 17h7v1H9zM19 17h4v1H19zM26 17h5v1H26zM34 17h7v1H34zM44 17h5v1H44zM1 18h5v1H1zM9 18h7v1H9zM19 18h4v1H19zM26 18h5v1H26zM34 18h7v1H34zM44 18h5v1H44zM1 19h5v1H1zM9 19h7v1H9zM19 19h4v1H19zM26 19h5v1H26zM34 19h7v1H34zM44 19h5v1H44zM1 20h5v1H1zM9 20h7v1H9zM19 20h4v1H19zM26 20h5v1H26zM34 20h7v1H34zM44 20h5v1H44zM1 21h5v1H1zM9 21h7v1H9zM19 21h4v1H19zM26 21h15v1H26zM44 21h5v1H44zM1 22h5v1H1zM9 22h7v1H9zM19 22h4v1H19zM27 22h14v1H27zM44 22h5v1H44zM1 23h5v1H1zM9 23h7v1H9zM19 23h4v1H19zM28 23h13v1H28zM44 23h5v1H44zM1 24h5v1H1zM9 24h7v1H9zM19 24h4v1H19zM29 24h12v1H29zM44 24h5v1H44zM1 25h5v1H1zM9 25h7v1H9zM19 25h4v1H19zM30 25h11v1H30zM44 25h5v1H44zM1 26h5v1H1zM9 26h7v1H9zM19 26h4v1H19zM34 26h7v1H34zM44 26h5v1H44zM1 27h21v1H1zM34 27h14v1H34zM1 28h20v1H1zM34 28h13v1H34zM2 29h18v1H2zM34 29h12v1H34zM3 30h13v1H3zM34 30h11v1H34zM4 31h12v1H4zM34 31h7v1H34zM9 32h7v1H9zM34 32h7v1H34zM9 33h7v1H9zM34 33h7v1H34zM9 34h7v1H9zM34 34h7v1H34zM9 35h7v1H9zM34 35h7v1H34zM9 36h7v1H9zM34 36h7v1H34zM9 37h7v1H9zM34 37h7v1H34zM9 38h7v1H9zM34 38h7v1H34zM9 39h7v1H9zM34 39h7v1H34zM9 40h7v1H9zM34 40h7v1H34zM9 41h7v1H9zM34 41h7v1H34zM9 42h7v1H9zM34 42h7v1H34zM9 43h7v1H9zM34 43h7v1H34zM9 44h7v1H9zM34 44h7v1H34zM9 45h7v1H9zM19 45h1v1H19zM34 45h7v1H34zM44 45h1v1H44zM5 46h1v1H5zM7 46h9v1H7zM30 46h1v1H30zM32 46h9v1H32zM16 48h1v1H16zM41 48h1v1H41z';
const largeCactusFrame3 =
	'M10 1h5v1H10zM60 1h5v1H60zM9 2h7v1H9zM59 2h7v1H59zM9 3h7v1H9zM32 3h3v1H32zM59 3h7v1H59zM9 4h7v1H9zM31 4h5v1H31zM59 4h7v1H59zM9 5h7v1H9zM31 5h5v1H31zM59 5h7v1H59zM9 6h7v1H9zM31 6h5v1H31zM59 6h7v1H59zM9 7h7v1H9zM31 7h5v1H31zM52 7h3v1H52zM59 7h7v1H59zM9 8h7v1H9zM31 8h5v1H31zM40 8h1v1H40zM51 8h5v1H51zM59 8h7v1H59zM9 9h7v1H9zM31 9h5v1H31zM39 9h3v1H39zM51 9h5v1H51zM59 9h7v1H59zM9 10h7v1H9zM31 10h5v1H31zM39 10h3v1H39zM51 10h5v1H51zM59 10h7v1H59zM9 11h7v1H9zM31 11h5v1H31zM39 11h3v1H39zM51 11h5v1H51zM59 11h7v1H59zM9 12h7v1H9zM20 12h2v1H20zM31 12h5v1H31zM39 12h3v1H39zM51 12h5v1H51zM59 12h7v1H59zM70 12h3v1H70zM2 13h3v1H2zM9 13h7v1H9zM19 13h4v1H19zM31 13h5v1H31zM39 13h3v1H39zM51 13h5v1H51zM59 13h7v1H59zM69 13h5v1H69zM1 14h5v1H1zM9 14h7v1H9zM19 14h4v1H19zM31 14h5v1H31zM39 14h3v1H39zM51 14h5v1H51zM59 14h7v1H59zM69 14h5v1H69zM1 15h5v1H1zM9 15h7v1H9zM19 15h4v1H19zM31 15h5v1H31zM39 15h3v1H39zM51 15h5v1H51zM59 15h7v1H59zM69 15h5v1H69zM1 16h5v1H1zM9 16h7v1H9zM19 16h4v1H19zM31 16h5v1H31zM39 16h3v1H39zM51 16h5v1H51zM59 16h7v1H59zM69 16h5v1H69zM1 17h5v1H1zM9 17h7v1H9zM19 17h4v1H19zM26 17h2v1H26zM31 17h5v1H31zM39 17h3v1H39zM51 17h5v1H51zM59 17h7v1H59zM69 17h5v1H69zM1 18h5v1H1zM9 18h7v1H9zM19 18h4v1H19zM25 18h4v1H25zM31 18h11v1H31zM51 18h5v1H51zM59 18h7v1H59zM69 18h5v1H69zM1 19h5v1H1zM9 19h7v1H9zM19 19h4v1H19zM25 19h4v1H25zM31 19h10v1H31zM51 19h5v1H51zM59 19h7v1H59zM69 19h5v1H69zM1 20h5v1H1zM9 20h7v1H9zM19 20h4v1H19zM25 20h4v1H25zM31 20h9v1H31zM45 20h1v1H45zM51 20h5v1H51zM59 20h7v1H59zM69 20h5v1H69zM1 21h5v1H1zM9 21h7v1H9zM19 21h4v1H19zM25 21h4v1H25zM31 21h5v1H31zM44 21h3v1H44zM51 21h15v1H51zM69 21h5v1H69zM1 22h5v1H1zM9 22h7v1H9zM19 22h4v1H19zM25 22h4v1H25zM31 22h5v1H31zM44 22h3v1H44zM51 22h15v1H51zM69 22h5v1H69zM1 23h5v1H1zM9 23h7v1H9zM19 23h4v1H19zM25 23h4v1H25zM31 23h5v1H31zM44 23h3v1H44zM52 23h14v1H52zM69 23h5v1H69zM1 24h5v1H1zM9 24h7v1H9zM19 24h4v1H19zM25 24h4v1H25zM31 24h5v1H31zM44 24h3v1H44zM53 24h13v1H53zM69 24h5v1H69zM1 25h5v1H1zM9 25h7v1H9zM19 25h4v1H19zM25 25h4v1H25zM31 25h5v1H31zM40 25h1v1H40zM44 25h3v1H44zM50 25h1v1H50zM54 25h12v1H54zM69 25h5v1H69zM1 26h5v1H1zM9 26h7v1H9zM19 26h4v1H19zM25 26h4v1H25zM31 26h5v1H31zM39 26h3v1H39zM44 26h3v1H44zM49 26h3v1H49zM59 26h7v1H59zM69 26h5v1H69zM1 27h5v1H1zM9 27h7v1H9zM19 27h4v1H19zM25 27h4v1H25zM31 27h5v1H31zM39 27h3v1H39zM44 27h3v1H44zM49 27h3v1H49zM59 27h7v1H59zM69 27h4v1H69zM1 28h21v1H1zM25 28h4v1H25zM31 28h5v1H31zM39 28h3v1H39zM44 28h3v1H44zM49 28h3v1H49zM59 28h13v1H59zM2 29h19v1H2zM25 29h4v1H25zM31 29h5v1H31zM39 29h3v1H39zM44 29h3v1H44zM49 29h3v1H49zM59 29h12v1H59zM3 30h17v1H3zM25 30h11v1H25zM39 30h3v1H39zM44 30h3v1H44zM49 30h3v1H49zM59 30h11v1H59zM4 31h12v1H4zM26 31h10v1H26zM39 31h3v1H39zM44 31h3v1H44zM49 31h3v1H49zM59 31h7v1H59zM5 32h11v1H5zM27 32h9v1H27zM39 32h3v1H39zM44 32h3v1H44zM49 32h3v1H49zM59 32h7v1H59zM9 33h7v1H9zM28 33h8v1H28zM39 33h3v1H39zM44 33h3v1H44zM49 33h3v1H49zM59 33h7v1H59zM9 34h7v1H9zM31 34h5v1H31zM39 34h3v1H39zM44 34h3v1H44zM49 34h3v1H49zM59 34h7v1H59zM9 35h7v1H9zM31 35h5v1H31zM40 35h11v1H40zM59 35h7v1H59zM9 36h7v1H9zM31 36h5v1H31zM41 36h9v1H41zM59 36h7v1H59zM9 37h7v1H9zM31 37h5v1H31zM42 37h5v1H42zM59 37h7v1H59zM9 38h7v1H9zM31 38h5v1H31zM44 38h3v1H44zM59 38h7v1H59zM9 39h7v1H9zM31 39h5v1H31zM44 39h3v1H44zM59 39h7v1H59zM9 40h7v1H9zM31 40h5v1H31zM44 40h3v1H44zM59 40h7v1H59zM9 41h7v1H9zM31 41h5v1H31zM44 41h3v1H44zM59 41h7v1H59zM9 42h7v1H9zM31 42h5v1H31zM44 42h3v1H44zM59 42h7v1H59zM9 43h7v1H9zM31 43h5v1H31zM44 43h3v1H44zM59 43h7v1H59zM9 44h7v1H9zM31 44h5v1H31zM44 44h3v1H44zM59 44h7v1H59zM9 45h7v1H9zM19 45h1v1H19zM31 45h5v1H31zM44 45h3v1H44zM59 45h7v1H59zM69 45h1v1H69zM9 46h7v1H9zM31 46h5v1H31zM44 46h3v1H44zM59 46h7v1H59zM5 47h1v1H5zM7 47h9v1H7zM24 47h1v1H24zM31 47h5v1H31zM44 47h3v1H44zM55 47h1v1H55zM57 47h9v1H57zM16 48h1v1H16zM40 48h1v1H40zM66 48h1v1H66z';

// @panel {type:'menu',items:['auto','light','dark']}
const colorScheme = 'auto';
// @panel
const showClouds = true;
// @panel
const showScore = true;

type Scheme = 'dark' | 'light';
type GameStatus = 'gameOver' | 'ready' | 'running';
type ObstacleKind =
	| 'large'
	| 'largeDouble'
	| 'largeTriple'
	| 'small'
	| 'smallDouble'
	| 'smallTriple';

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

type RenderState = {
	readonly frame: GameFrame;
	readonly motionDuration: number;
	readonly motionFrame: GameFrame;
};

type TimelineDateOptions = {
	readonly endAt: number;
	readonly exactDates: number[];
	readonly inApp: boolean;
	readonly record: GameRecord;
	readonly startAt: number;
};

function widget(entry: WidgetEntry) {
	const record = readGameRecord();
	const renderState = getRenderState(record, entry.date.getTime());
	const palette = getPalette(colorScheme, entry.colorScheme);
	const layout = getStageLayout(entry.size);

	return (
		<ZStack clipped maxSides buttonStyle={buttonStyle}>
			<Button
				audio
				fast
				frame={{width: entry.size.width, height: entry.size.height}}
				intent={app.tap()}
			>
				<ZStack clipped maxSides>
					<Color value={palette.background} />
					{renderStage(renderState, palette, layout, entry.size)}
					{showScore ? renderScore(renderState.frame, palette) : undefined}
					{renderStatus(renderState.frame, palette)}
				</ZStack>
			</Button>
		</ZStack>
	);
}

function renderStage(
	renderState: RenderState,
	palette: Palette,
	layout: StageLayout,
	size: Size,
) {
	const {frame, motionDuration, motionFrame} = renderState;
	const motionAnimation = getMotionAnimation(
		frame,
		motionFrame,
		motionDuration,
	);
	const dinoTop = groundY - dinoHeight - motionFrame.dinoY;
	const dinoFrame = frame.status === 'gameOver' ? 0 : motionFrame.legFrame;

	return (
		<ZStack maxSides>
			{showClouds
				? motionFrame.clouds.map((cloud) => {
						const width = scaleValue(cloud.width, layout);
						const height = scaleValue(16, layout);

						return (
							// eslint-disable-next-line react/jsx-key
							<ZStack
								animation={motionAnimation}
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
			{getGroundDashes(motionFrame.distance).map((dash) => {
				const width = scaleValue(dash.width, layout);
				const height = Math.max(1, scaleValue(1, layout));

				return (
					// eslint-disable-next-line react/jsx-key
					<Color
						animation={motionAnimation}
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
			{motionFrame.obstacles.map((obstacle) => {
				const width = scaleValue(obstacle.width, layout);
				const height = scaleValue(obstacle.height, layout);

				return (
					// eslint-disable-next-line react/jsx-key
					<ZStack
						animation={motionAnimation}
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
				animation={motionAnimation}
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
		AwaitStore.set(ttlStoreKey, now);
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
	AwaitStore.set(ttlStoreKey, now);
	AwaitUI.haptic('impact');
}

function widgetTimeline(): Timeline {
	const now = Date.now();
	const record = readGameRecord();
	const frame = getGameFrame(record, now);
	const ttlBumped = now - AwaitStore.num(ttlStoreKey, 0) < 500;

	if (frame.status === 'gameOver' && record.startedAt > 0) {
		persistBestScore(frame.score);
		if (record.gameOverAt === 0 || record.gameOverAt > now) {
			AwaitStore.set(gameStoreKey, {
				...record,
				gameOverAt: now,
			});
		}

		return {
			entries: [{date: new Date()}],
			update: 'never',
		};
	}

	if (frame.status !== 'running') {
		return {
			entries: [{date: new Date()}],
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

	const timelineEndAt =
		gameOverAt > 0 ? gameOverAt + gameOverHold : now + predictionHorizon;
	const exactDates = gameOverAt > 0 ? [gameOverAt] : [];
	const entries = getTimelineDates({
		endAt: timelineEndAt,
		exactDates,
		inApp: AwaitEnv.host === 'app',
		record,
		startAt: now,
	}).map((date) => ({
		date,
	}));

	if (ttlBumped) {
		entries.unshift({date: new Date()});
	}

	return {
		entries,
		update: gameOverAt > 0 ? 'never' : new Date(timelineEndAt),
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
	const score = getScore(distance);
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
		legFrame: Math.floor(elapsed / runFrameDuration) % 2,
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
		obstacles: [],
		score: 0,
		status: 'ready',
	};
}

function getRenderState(record: GameRecord, now: number): RenderState {
	const frame = getGameFrame(record, now);
	if (frame.status !== 'running') {
		return {
			frame,
			motionDuration: 0,
			motionFrame: frame,
		};
	}

	const inApp = AwaitEnv.host === 'app';
	const interval = getTimelineFrameInterval(record, now, inApp);
	if (inApp) {
		return {
			frame,
			motionDuration: interval / 1000,
			motionFrame: frame,
		};
	}

	const targetTime = getWidgetMotionTargetTime(record, now, interval);

	return {
		frame,
		motionDuration: Math.max(0.01, (targetTime - now) / 1000),
		motionFrame: getGameFrame(record, targetTime),
	};
}

function getMotionAnimation(
	frame: GameFrame,
	motionFrame: GameFrame,
	duration: number,
): NativeAnimation | undefined {
	if (frame.status !== 'running' || duration <= 0) {
		return;
	}

	return {
		duration,
		type: 'linear',
		value: motionFrame.animationKey,
	};
}

function getWidgetMotionTargetTime(
	record: GameRecord,
	now: number,
	interval: number,
): number {
	const targetTime = now + interval;
	if (record.gameOverAt > now && record.gameOverAt < targetTime) {
		return record.gameOverAt;
	}

	return targetTime;
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
	if (elapsed <= 0) {
		return 0;
	}

	const framesElapsed = elapsed / chromeMsPerFrame;
	const groundDinoY = groundY - dinoHeight;
	const y =
		groundDinoY +
		chromeInitialJumpVelocity * framesElapsed +
		(chromeGravity * framesElapsed * framesElapsed) / 2;

	if (y >= groundDinoY) {
		return 0;
	}

	return groundDinoY - Math.max(chromeMaxJumpY, y);
}

function getDistance(elapsed: number): number {
	const seconds = elapsed / 1000;
	const startSpeed = chromeInitialSpeed * chromeFps;
	const acceleration = chromeAcceleration * chromeFps * chromeFps;
	const maxSpeed = chromeMaxSpeed * chromeFps;
	const timeToMax = (maxSpeed - startSpeed) / acceleration;

	if (seconds <= timeToMax) {
		return startSpeed * seconds + (acceleration * seconds * seconds) / 2;
	}

	const distanceAtMax =
		startSpeed * timeToMax + (acceleration * timeToMax * timeToMax) / 2;

	return distanceAtMax + maxSpeed * (seconds - timeToMax);
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

	return 0;
}

function getTimelineDates(options: TimelineDateOptions): Date[] {
	const times: number[] = [];

	for (let time = options.startAt; time <= options.endAt; ) {
		times.push(time);
		time += getTimelineFrameInterval(options.record, time, options.inApp);
	}

	times.push(options.endAt);
	for (const exactDate of options.exactDates) {
		if (exactDate >= options.startAt && exactDate <= options.endAt) {
			times.push(exactDate);
		}
	}

	return [...new Set(times.map((time) => Math.floor(time)))]
		.toSorted((first, second) => first - second)
		.map((time) => new Date(time));
}

function getTimelineFrameInterval(
	record: GameRecord,
	time: number,
	inApp: boolean,
): number {
	if (inApp) {
		return runFrameDuration;
	}

	return isJumpActive(record, time)
		? widgetJumpFrameInterval
		: widgetMotionFrameInterval;
}

function isJumpActive(record: GameRecord, time: number): boolean {
	if (record.jumpStartedAt <= record.startedAt) {
		return false;
	}

	const elapsed = time - record.jumpStartedAt;

	return elapsed >= 0 && elapsed <= chromeJumpDuration;
}

function getObstacles(distance: number, seed: number): ObstacleFrame[] {
	const obstacles: ObstacleFrame[] = [];
	const endDistance = distance + stageWidth + 80;
	let worldX = getDistance(chromeClearTime) + stageWidth;

	for (let order = 0; worldX <= endDistance && order < 200; order++) {
		const speed = getChromeSpeedForDistance(worldX);
		const variant = getObstacleVariant(seed, order, speed);
		const x = worldX - distance;
		if (x > stageWidth + 40 || x < -variant.width - 20) {
			worldX += variant.width + getObstacleGap(seed, order, variant, speed);
			continue;
		}

		obstacles.push({
			height: variant.height,
			id: `obstacle-${order}`,
			kind: variant.kind,
			width: variant.width,
			x,
		});
		worldX += variant.width + getObstacleGap(seed, order, variant, speed);
	}

	return obstacles;
}

function getObstacleVariant(
	seed: number,
	order: number,
	speed: number,
): {height: number; kind: ObstacleKind; size: number; width: number} {
	const roll = seededFraction(seed + order * 73);
	const isSmall = roll < 0.5;
	const baseWidth = isSmall ? 17 : 25;
	const height = isSmall ? 35 : 50;
	const multipleSpeed = isSmall ? 3 : 6;
	const randomSize = Math.floor(seededFraction(seed + order * 97) * 3) + 1;
	const size = randomSize > 1 && multipleSpeed > speed ? 1 : randomSize;
	const kind = getObstacleKind(isSmall, size);

	return {
		height,
		kind,
		size,
		width: baseWidth * size,
	};
}

function getObstacleKind(isSmall: boolean, size: number): ObstacleKind {
	if (isSmall) {
		if (size === 3) {
			return 'smallTriple';
		}

		if (size === 2) {
			return 'smallDouble';
		}

		return 'small';
	}

	if (size === 3) {
		return 'largeTriple';
	}

	if (size === 2) {
		return 'largeDouble';
	}

	return 'large';
}

function getObstacleGap(
	seed: number,
	order: number,
	obstacle: {width: number},
	speed: number,
): number {
	const minGap = Math.round(
		obstacle.width * speed + chromeObstacleMinGap * chromeGapCoefficient,
	);
	const maxGap = Math.round(minGap * chromeMaxGapCoefficient);
	const roll = seededFraction(seed + order * 131);

	return Math.round(minGap + (maxGap - minGap) * roll);
}

function getChromeSpeedForDistance(distance: number): number {
	const startSpeed = chromeInitialSpeed * chromeFps;
	const acceleration = chromeAcceleration * chromeFps * chromeFps;
	const maxSpeed = chromeMaxSpeed * chromeFps;
	const timeToMax = (maxSpeed - startSpeed) / acceleration;
	const distanceAtMax =
		startSpeed * timeToMax + (acceleration * timeToMax * timeToMax) / 2;

	if (distance <= distanceAtMax) {
		const seconds =
			(-startSpeed +
				Math.sqrt(startSpeed * startSpeed + 2 * acceleration * distance)) /
			acceleration;
		const stageSpeed = startSpeed + acceleration * seconds;

		return stageSpeed / chromeFps;
	}

	return chromeMaxSpeed;
}

function getScore(distance: number): number {
	return Math.max(0, Math.floor(distance * 0.025));
}

function getClouds(distance: number, seed: number): CloudFrame[] {
	return Array.from({length: 6}, (_, index) => {
		const order = Math.floor((distance * 0.2) / 88) + index;
		const width = 34 + Math.floor(seededFraction(seed + order * 17) * 12);
		const x = stageWidth + 40 + index * 88 - ((distance * 0.2) % 88);
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
	const isSmall = kind.startsWith('small');
	const baseWidth = isSmall ? 17 : 25;
	const height = isSmall ? 35 : 50;
	const size = kind.endsWith('Triple') ? 3 : kind.endsWith('Double') ? 2 : 1;
	const path = getObstaclePath(kind);

	return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${baseWidth * size} ${height}" shape-rendering="crispEdges"><path fill="${fill}" d="${path}"/></svg>`;
}

function getObstaclePath(kind: ObstacleKind): string {
	if (kind === 'small') {
		return smallCactusFrame1;
	}

	if (kind === 'smallDouble') {
		return smallCactusFrame2;
	}

	if (kind === 'smallTriple') {
		return smallCactusFrame3;
	}

	if (kind === 'largeDouble') {
		return largeCactusFrame2;
	}

	if (kind === 'largeTriple') {
		return largeCactusFrame3;
	}

	return largeCactusFrame1;
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

const buttonStyle: CustomButtonStyle = {
	normal: (
		<Modifier
			geometryGroup
			animation={{type: 'snappy', duration: 0.08}}
			scaleEffect={1}
		/>
	),
	press: (
		<Modifier
			geometryGroup
			animation={{type: 'snappy', duration: 0.08}}
			scaleEffect={1}
		/>
	),
};
