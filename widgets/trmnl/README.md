# TRMNL

An Await widget that shows the current TRMNL display image using a device API key.

<p align="center"><img src="./assets/screenshot-large.webp" width="400" /></p>

## Configuration

Open the widget panel and set:

- `trmnlDeviceApiKey`: a TRMNL device API key, entered as a password field
- `apiBaseUrl`: the TRMNL API base URL

The widget requests `GET https://trmnl.com/api/display/current` with:

```http
Access-Token: device_xxxxx
Accept: application/json
```

## Usage

See the project root's [README.md](../../README.md#usage) for general usage instructions.
