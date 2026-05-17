# LibreTranslate-MCP

![Build Status](https://img.shields.io/github/actions/workflow/status/LibreTranslate/LibreTranslate-MCP/ci.yml?branch=master) ![Version](https://img.shields.io/github/v/release/LibreTranslate/LibreTranslate-MCP)

A [MCP](https://modelcontextprotocol.io/docs/getting-ting-started/intro) server to connect AI agents with [LibreTranslate](https://github.com/LibreTranslate/LibreTranslate) to give them machine translation capabilities.

## Usage

Add this to your client's configuration:

### OpenCode

```json
{
  "mcp": {
    "LibreTranslate": {
      "command": ["npx", "-y", "@libretranslate/mcp"],
      "environment": {
        "LIBRETRANSLATE_API_URL": "https://libretranslate.com",
        "LIBRETRANSLATE_API_KEY": "your-api-key"
      }
    }
  }
}
```

### Claude

```json
{
  "mcpServers": {
    "libretranslate": {
      "command": "npx",
      "args": ["-y", "@libretranslate/mcp"],
      "env": {
        "LIBRETRANSLATE_API_URL": "https://libretranslate.com",
        "LIBRETRANSLATE_API_KEY": "your-api-key"
      }
    }
  }
}
```

### Configuration

Set the following environment variables:

| Variable                 | Required           | Description                                                                |
| ------------------------ | ------------------ | -------------------------------------------------------------------------- |
| `LIBRETRANSLATE_API_URL` | :check_mark_heavy: | URL of the LibreTranslate API (default: `https://libretranslate.com`)      |
| `LIBRETRANSLATE_API_KEY` |                    | API key for the LibreTranslate service (required for `libretranslate.com`) |


## Available Tools

### `detect`

Detect the language of a given text.

**Input:**
- `text` (string): The text to detect the language for

**Example:**
```json
{ "text": "Hello, world!" }
```

**Response:**
```json
{
  "language": "en",
  "confidence": 0.99
}
```

### `translate`

Translate text from one language to another.


### `languages`

List all supported languages for translation.

### License

AGPLv3
