import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { z } from 'zod'
import { detectLanguage, translate, listLanguages } from './lib/client.js'

const API_URL = process.env.LIBRETRANSLATE_API_URL
const API_KEY = process.env.LIBRETRANSLATE_API_KEY

const config = { apiUrl: API_URL, apiKey: API_KEY }

export async function startServer() {
  const server = new McpServer({
    name: 'libretranslate-mcp',
    version: '1.0.0',
  })

  server.registerTool(
    'detect',
    {
      description: 'Detect the language of a given text',
      inputSchema: { text: z.string() },
    },
    async ({ text }) => {
      try {
        const result = await detectLanguage(text, config)
        return {
          content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err)
        return {
          content: [{ type: 'text', text: JSON.stringify({ error: message }) }],
          isError: true,
        }
      }
    }
  )

  server.registerTool(
    'translate',
    {
      description: 'Translate text from one language to another',
      inputSchema: {
        text: z.string(),
        source: z.string(),
        target: z.string(),
      },
    },
    async ({ text, source, target }) => {
      try {
        const result = await translate(text, source, target, config)
        return {
          content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err)
        return {
          content: [{ type: 'text', text: JSON.stringify({ error: message }) }],
          isError: true,
        }
      }
    }
  )

  server.registerTool(
    'languages',
    {
      description: 'List all supported languages for translation',
      inputSchema: {},
    },
    async () => {
      try {
        const result = await listLanguages(config)
        return {
          content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err)
        return {
          content: [{ type: 'text', text: JSON.stringify({ error: message }) }],
          isError: true,
        }
      }
    }
  )

  const transport = new StdioServerTransport()
  await server.connect(transport)
}

startServer().catch((err) => {
  console.error('Server error:', err)
  process.exit(1)
})
