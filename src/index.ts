interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

interface McpToolExport {
  tools: McpToolDefinition[];
  callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>;
  meter?: { credits: number };
  cost?: Record<string, unknown>;
  provider?: string;
}

/**
 * Number & currency formatting MCP.
 *
 * Keyless, offline: format a number as localized currency, a plain/grouped
 * number, a percentage, or a compact form (1.2K / 3.4M), using the platform
 * Intl.NumberFormat. No API, no key. (Formatting/locale only — not FX
 * conversion; use an exchange-rate pack for that.)
 */


const tools: McpToolExport['tools'] = [
  {
    name: 'format_currency',
    description: 'Format a number as localized currency (keyless, offline). E.g. amount 1234.5, currency "EUR", locale "de-DE" -> "1.234,50 €". `currency` is an ISO 4217 code.',
    inputSchema: {
      type: 'object',
      properties: {
        amount: { type: 'number', description: 'The monetary amount.' },
        currency: { type: 'string', description: 'ISO 4217 code, e.g. "USD", "EUR", "JPY".' },
        locale: { type: 'string', description: 'BCP-47 locale (default "en-US"), e.g. "de-DE", "ja-JP".' },
      },
      required: ['amount', 'currency'],
    },
  },
  {
    name: 'format_number',
    description: 'Format a number with grouping, fixed decimals, as a percentage, or in compact notation (keyless, offline). style = "decimal" (default), "percent", or "compact".',
    inputSchema: {
      type: 'object',
      properties: {
        number: { type: 'number', description: 'The number to format.' },
        locale: { type: 'string', description: 'BCP-47 locale (default "en-US").' },
        style: { type: 'string', description: 'decimal (default) | percent | compact.' },
        decimals: { type: 'number', description: 'Fixed number of fraction digits.' },
      },
      required: ['number'],
    },
  },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  const locale = typeof args.locale === 'string' && args.locale ? args.locale : 'en-US';
  try {
    switch (name) {
      case 'format_currency': {
        const amount = num(args, 'amount');
        const currency = reqStr(args, 'currency', '"USD"').toUpperCase();
        const formatted = new Intl.NumberFormat(locale, { style: 'currency', currency }).format(amount);
        return { amount, currency, locale, formatted };
      }
      case 'format_number': {
        const number = num(args, 'number');
        const style = (typeof args.style === 'string' ? args.style : 'decimal').toLowerCase();
        const opts: Intl.NumberFormatOptions = {};
        if (style === 'percent') opts.style = 'percent';
        else if (style === 'compact') opts.notation = 'compact';
        if (typeof args.decimals === 'number') { opts.minimumFractionDigits = args.decimals; opts.maximumFractionDigits = args.decimals; }
        return { number, locale, style, formatted: new Intl.NumberFormat(locale, opts).format(number) };
      }
      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (e) {
    return { error: (e as Error).message, hint: 'Check the currency (ISO 4217, e.g. "USD") and locale (BCP-47, e.g. "en-US").' };
  }
}

function num(args: Record<string, unknown>, key: string): number {
  const v = args[key]; const n = typeof v === 'number' ? v : typeof v === 'string' ? Number(v) : NaN;
  if (!Number.isFinite(n)) throw new Error(`Required numeric argument "${key}" is missing or invalid.`);
  return n;
}
function reqStr(args: Record<string, unknown>, key: string, ex: string): string {
  const v = args[key];
  if (typeof v !== 'string' || !v.trim()) throw new Error(`Required argument "${key}" is missing. Pass a string like ${ex}.`);
  return v;
}

export default { tools, callTool, meter: { credits: 1 } } satisfies McpToolExport;
