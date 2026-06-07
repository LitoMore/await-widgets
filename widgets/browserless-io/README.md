# Browserless.io

An Await widget that captures a page through the Browserless.io `/screenshot` API and displays the latest screenshot.

## Configuration

Open the widget panel and set:

- `browserlessToken`: your Browserless API token, entered as a password field
- `targetUrl`: the page to capture
- `apiBaseUrl`: the Browserless API base URL, defaulting to `https://production-sfo.browserless.io`
- `imageType`: `png`, `jpeg`, or `webp`
- `imageQuality`: quality used for `jpeg` and `webp`
- `waitForTimeoutMs`: extra wait time before capture
- `updateInterval`: how often Await refreshes the screenshot

The widget requests `POST {apiBaseUrl}/screenshot?token=...` with `options.encoding` set to `base64`, then renders the returned screenshot as an image.

The Browserless viewport is derived from the current widget size on each timeline refresh:

```json
{
	"viewport": {
		"width": "<widget width>",
		"height": "<widget height>",
		"deviceScaleFactor": "<display scale>"
	}
}
```

This keeps the captured browser window matched to the widget instead of using a fixed screenshot size.

## Usage

See the project root's [README.md](../../README.md#usage) for general usage instructions.
