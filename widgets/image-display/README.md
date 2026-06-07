# Image Display

An Await widget that displays a configurable raster or SVG image URL with simple fit, crop, stretch, or tile behavior.

<p align="center"><img src="./assets/screenshot-all.webp" width="200" /></p>

## Configuration

Open the widget panel and set:

- `imageUrl`: the image URL to display. It can be an absolute URL, a data URI, or a relative path to a file bundled with the widget.
- `imageType`: whether to render the URL as `auto`, `image`, or `svg`
- `displayMode`: how the image should fill the widget
- `imagePosition`: where the image should be anchored when it does not fill evenly
- `backgroundColor`: the fallback background color behind the image, defaulting to transparent
- `paddingTop`, `paddingRight`, `paddingBottom`, `paddingLeft`: padding around the displayed image or placeholder content

When `imageType` is `auto`, the widget treats `.svg`/`.svgz` URLs and `data:image/svg+xml` URLs as SVGs. Use `svg` for SVG URLs that do not include a detectable extension or data URI media type, and use `image` to force raster image rendering.

To display a local image, add the file to the widget's files in Await and set `imageUrl` to its relative path, such as `./photo.png` or `images/logo.svg`.

## Display Modes

- `cover`: scales the image to fill the widget and clips any overflow
- `contain`: scales the whole image to fit inside the widget
- `stretch`: resizes the image to the widget bounds without preserving aspect ratio
- `tile`: repeats the image across the widget

SVG images are rendered with Await's native `Svg` component. Because that component does not expose tiled resizing, SVGs set to `tile` render once using the widget bounds instead of repeating.

When `imageUrl` is empty, the widget shows a placeholder message prompting configuration in the widget panel.

## Usage

See the project root's [README.md](../../README.md#usage) for general usage instructions.
