# TRMNL

An Await widget that shows the current TRMNL display image using a device API key, with optional color inversion and transparency.

<p align="center"><img src="./assets/screenshot-large.webp" width="400" /></p>

<p align="center"><a href="https://apps.apple.com/app/id6755678187"><img src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"/></a></p>

## Usage

1. Download the Await app from the [App Store](https://apps.apple.com/app/id6755678187)
1. Open the Await app and create a new widget with name "TRMNL"
1. Press the "TRMNL" from the list of available widgets to open the configuration panel
1. Press the `index.tsx` from the `Files` section to open the code editor and copy the [TRMNL widget code](./index.tsx) to the editor, then press "Save"
1. You will be able to see `trmnlDeviceApiKey`, `apiBaseUrl`, `apiPath`, `colorInvert`, and `useTransparent` fields in the widget panel
1. Configure your TRMNL [device API key](https://docs.trmnl.com/go/private-api/screens), base URL, API path, and display effects in the widget panel
1. Go to your device home screen/desktop and add the Await widget
1. Long press the widget and tap "Edit Widget"
1. Choose your widget from the list
1. The widget will display the current TRMNL display image

## Configuration

- `trmnlDeviceApiKey`: a TRMNL device API key, entered as a password field
- `apiBaseUrl`: the TRMNL API base URL, defaulting to `https://trmnl.com`; use your server URL for BYOS
- `apiPath`: the display API path, defaulting to `/api/display`; on TRMNL's hosted service, this advances the playlist on each request. Use `/api/current_screen` to mirror the current screen, or the equivalent path supported by your BYOS server
- `colorInvert`: whether to invert the display image colors
- `useTransparent`: whether to make the light areas of the display image transparent

## Refresh behavior

The widget uses the API response's `refresh_rate` (in seconds, as a number or numeric string) to request its next timeline update. If the value is missing or invalid, or the request fails, it schedules another update in 30 minutes. Failed requests keep the last successfully loaded image.

Actual home screen widget refreshes are scheduled by iOS. A server setting of 15 seconds requests that interval but cannot guarantee an update every 15 seconds. See Await's [timeline documentation](https://docs.awaitwidget.com/guides/timeline) for details.
