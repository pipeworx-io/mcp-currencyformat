# mcp-currencyformat

Number & currency formatting MCP.

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1167+ live data sources.

## Tools

| Tool | Description |
|------|-------------|
| `format_currency` | Format a number as localized currency (keyless, offline). E.g. amount 1234.5, currency "EUR", locale "de-DE" -> "1.234,50 €". `currency` is an ISO 4217 code. |
| `format_number` | Format a number with grouping, fixed decimals, as a percentage, or in compact notation (keyless, offline). style = "decimal" (default), "percent", or "compact". |

## Quick Start

Add to your MCP client (Claude Desktop, Cursor, Windsurf, etc.):

```json
{
  "mcpServers": {
    "currencyformat": {
      "url": "https://gateway.pipeworx.io/currencyformat/mcp"
    }
  }
}
```

Or connect to the full Pipeworx gateway for access to all 1167+ data sources:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English:

```
ask_pipeworx({ question: "your question about Currencyformat data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [All tools and guides](https://github.com/pipeworx-io/examples)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
