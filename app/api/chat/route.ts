import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { callMcpTool } from "@/lib/mcp-tools";
import { buildSystemPrompt } from "@/lib/agent-system-prompt";
import { MessageParam } from "@anthropic-ai/sdk/resources/messages";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY || "dummy_key" });

// Tool definitions passed to Claude
const KAPRUKA_TOOLS: Anthropic.Tool[] = [
  {
    name: "kapruka_search_products",
    description: "Search the live Kapruka catalog by keyword or category. Use this whenever the user asks about products, gifts, or wants to browse.",
    input_schema: {
      type: "object",
      properties: {
        query: { type: "string", description: "Search query, e.g. 'birthday cake' or 'Samsung phone'" },
        category: { type: "string", description: "Optional category slug to filter results" },
        limit: { type: "number", description: "Max results (default 10, max 20)" }
      },
      required: ["query"]
    }
  },
  {
    name: "kapruka_get_categories",
    description: "Get Kapruka product categories. Call with no parent_id for root categories.",
    input_schema: {
      type: "object",
      properties: {
        parent_id: { type: "string", description: "Parent category ID for subcategories" }
      }
    }
  },
  {
    name: "kapruka_get_product",
    description: "Get full details, images, and variants for a specific product by ID.",
    input_schema: {
      type: "object",
      properties: {
        product_id: { type: "string" }
      },
      required: ["product_id"]
    }
  },
  {
    name: "kapruka_quote_delivery",
    description: "Check delivery availability and get the flat delivery fee for a product to a city on a specific date. Always call this before creating an order.",
    input_schema: {
      type: "object",
      properties: {
        product_id: { type: "string" },
        city: { type: "string", description: "Sri Lankan city name, e.g. 'Colombo', 'Kandy', 'Galle'" },
        delivery_date: { type: "string", description: "ISO 8601 date string: YYYY-MM-DD" }
      },
      required: ["product_id", "city", "delivery_date"]
    }
  },
  {
    name: "kapruka_create_order",
    description: "Create a guest checkout order and return a 60-minute pay link. Collect recipient name, phone, address, city, and delivery date BEFORE calling this.",
    input_schema: {
      type: "object",
      properties: {
        items: {
          type: "array",
          items: {
            type: "object",
            properties: {
              product_id: { type: "string" },
              variant_id: { type: "string" },
              quantity: { type: "number" }
            },
            required: ["product_id", "quantity"]
          }
        },
        recipient: {
          type: "object",
          properties: {
            name: { type: "string" },
            phone: { type: "string" },
            address: { type: "string" },
            city: { type: "string" }
          },
          required: ["name", "phone", "address", "city"]
        },
        delivery_date: { type: "string" },
        gift_message: { type: "string", description: "Optional gift note (max 200 chars)" },
        sender_name: { type: "string", description: "Name shown on gift card" }
      },
      required: ["items", "recipient", "delivery_date"]
    }
  },
  {
    name: "kapruka_track_order",
    description: "Track an existing order by order ID. The customer finds their order ID in their confirmation email.",
    input_schema: {
      type: "object",
      properties: {
        order_id: { type: "string" }
      },
      required: ["order_id"]
    }
  },
  {
    name: "kapruka_check_availability",
    description: "Quick check whether a product can be delivered to a specific city.",
    input_schema: {
      type: "object",
      properties: {
        product_id: { type: "string" },
        city: { type: "string" }
      },
      required: ["product_id", "city"]
    }
  }
];

// Tool definitions passed to Gemini (requires uppercase type definitions)
const GEMINI_TOOLS = [
  {
    name: "kapruka_search_products",
    description: "Search the live Kapruka catalog by keyword or category. Use this whenever the user asks about products, gifts, or wants to browse.",
    parameters: {
      type: "OBJECT",
      properties: {
        query: { type: "STRING", description: "Search query, e.g. 'birthday cake' or 'Samsung phone'" },
        category: { type: "STRING", description: "Optional category slug to filter results" },
        limit: { type: "NUMBER", description: "Max results (default 10, max 20)" }
      },
      required: ["query"]
    }
  },
  {
    name: "kapruka_get_categories",
    description: "Get Kapruka product categories. Call with no parent_id for root categories.",
    parameters: {
      type: "OBJECT",
      properties: {
        parent_id: { type: "STRING", description: "Parent category ID for subcategories" }
      }
    }
  },
  {
    name: "kapruka_get_product",
    description: "Get full details, images, and variants for a specific product by ID.",
    parameters: {
      type: "OBJECT",
      properties: {
        product_id: { type: "STRING" }
      },
      required: ["product_id"]
    }
  },
  {
    name: "kapruka_quote_delivery",
    description: "Check delivery availability and get the flat delivery fee for a product to a city on a specific date. Always call this before creating an order.",
    parameters: {
      type: "OBJECT",
      properties: {
        product_id: { type: "STRING" },
        city: { type: "STRING", description: "Sri Lankan city name, e.g. 'Colombo', 'Kandy', 'Galle'" },
        delivery_date: { type: "STRING", description: "ISO 8601 date string: YYYY-MM-DD" }
      },
      required: ["product_id", "city", "delivery_date"]
    }
  },
  {
    name: "kapruka_create_order",
    description: "Create a guest checkout order and return a 60-minute pay link. Collect recipient name, phone, address, city, and delivery date BEFORE calling this.",
    parameters: {
      type: "OBJECT",
      properties: {
        items: {
          type: "ARRAY",
          items: {
            type: "OBJECT",
            properties: {
              product_id: { type: "STRING" },
              variant_id: { type: "STRING" },
              quantity: { type: "NUMBER" }
            },
            required: ["product_id", "quantity"]
          }
        },
        recipient: {
          type: "OBJECT",
          properties: {
            name: { type: "STRING" },
            phone: { type: "STRING" },
            address: { type: "STRING" },
            city: { type: "STRING" }
          },
          required: ["name", "phone", "address", "city"]
        },
        delivery_date: { type: "STRING" },
        gift_message: { type: "STRING", description: "Optional gift note (max 200 chars)" },
        sender_name: { type: "STRING", description: "Name shown on gift card" }
      },
      required: ["items", "recipient", "delivery_date"]
    }
  },
  {
    name: "kapruka_track_order",
    description: "Track an existing order by order ID. The customer finds their order ID in their confirmation email.",
    parameters: {
      type: "OBJECT",
      properties: {
        order_id: { type: "STRING" }
      },
      required: ["order_id"]
    }
  },
  {
    name: "kapruka_check_availability",
    description: "Quick check whether a product can be delivered to a specific city.",
    parameters: {
      type: "OBJECT",
      properties: {
        product_id: { type: "STRING" },
        city: { type: "STRING" }
      },
      required: ["product_id", "city"]
    }
  }
];

export async function POST(req: NextRequest) {
  const { messages, language, cart } = await req.json();
  
  const systemPrompt = buildSystemPrompt(language, cart);

  // Agentic loop with tool use
  const encoder = new TextEncoder();
  const stream = new TransformStream();
  const writer = stream.writable.getWriter();

  const useGemini = !!process.env.GEMINI_API_KEY;

  (async () => {
    try {
      if (useGemini) {
        // Run Gemini agentic loop
        let geminiMessages = messages.map((msg: any) => ({
          role: msg.role === "user" ? "user" : "model",
          parts: [{ text: msg.content || "..." }]
        }));

        while (true) {
          const body = {
            contents: geminiMessages,
            systemInstruction: {
              parts: [{ text: systemPrompt }]
            },
            tools: [{ functionDeclarations: GEMINI_TOOLS }],
            generationConfig: {
              maxOutputTokens: 4096,
              temperature: 0.7
            }
          };

          const res = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify(body)
            }
          );

          if (!res.ok) {
            const errText = await res.text();
            throw new Error(`Gemini API returned status ${res.status}: ${errText}`);
          }

          const data = await res.json();
          const candidate = data.candidates?.[0];
          const modelParts = candidate?.content?.parts || [];
          
          const functionCalls = modelParts.filter((p: any) => p.functionCall);

          if (functionCalls.length > 0) {
            for (const callPart of functionCalls) {
              const fc = callPart.functionCall;
              await writer.write(encoder.encode(
                `data: ${JSON.stringify({ type: "tool_start", tool: fc.name, input: fc.args })}\n\n`
              ));
            }

            const responseParts = await Promise.all(
              functionCalls.map(async (callPart: any) => {
                const fc = callPart.functionCall;
                const result = await callMcpTool(fc.name, fc.args);

                await writer.write(encoder.encode(
                  `data: ${JSON.stringify({ type: "tool_result", tool: fc.name, result, input: fc.args })}\n\n`
                ));

                return {
                  functionResponse: {
                    name: fc.name,
                    response: { result }
                  }
                };
              })
            );

            geminiMessages = [
              ...geminiMessages,
              { role: "model", parts: modelParts },
              { role: "user", parts: responseParts }
            ];
          } else {
            const finalText = modelParts
              .filter((p: any) => p.text)
              .map((p: any) => p.text)
              .join("");

            // Stream final text word by word for typing effect
            const words = finalText.split(" ");
            for (const word of words) {
              await writer.write(encoder.encode(
                `data: ${JSON.stringify({ type: "text", delta: word + " " })}\n\n`
              ));
              await new Promise(r => setTimeout(r, 15));
            }

            await writer.write(encoder.encode(`data: ${JSON.stringify({ type: "done" })}\n\n`));
            break;
          }
        }
      } else {
        // Run Anthropic loop (fallback)
        let currentMessages: MessageParam[] = messages;
        while (true) {
          const response = await anthropic.messages.create({
            model: "claude-sonnet-4-20250514",
            max_tokens: 4096,
            system: systemPrompt,
            tools: KAPRUKA_TOOLS,
            messages: currentMessages,
            stream: false
          });

          if (response.stop_reason === "tool_use") {
            const toolUseBlocks = response.content.filter(b => b.type === "tool_use");
            for (const toolBlock of toolUseBlocks) {
              await writer.write(encoder.encode(
                `data: ${JSON.stringify({ type: "tool_start", tool: toolBlock.name, input: toolBlock.input })}\n\n`
              ));
            }

            const toolResults = await Promise.all(
              toolUseBlocks.map(async (toolBlock) => {
                if (toolBlock.type !== "tool_use") return null;
                const result = await callMcpTool(toolBlock.name, toolBlock.input as Record<string, unknown>);

                await writer.write(encoder.encode(
                  `data: ${JSON.stringify({ type: "tool_result", tool: toolBlock.name, result, input: toolBlock.input })}\n\n`
                ));

                return {
                  type: "tool_result" as const,
                  tool_use_id: toolBlock.id,
                  content: JSON.stringify(result)
                };
              })
            );

            currentMessages = [
              ...currentMessages,
              { role: "assistant" as const, content: response.content },
              { role: "user" as const, content: toolResults.filter(Boolean) as Anthropic.ToolResultBlockParam[] }
            ];
          } else {
            const finalText = response.content
              .filter(b => b.type === "text")
              .map(b => (b as Anthropic.TextBlock).text)
              .join("");

            const words = finalText.split(" ");
            for (const word of words) {
              await writer.write(encoder.encode(
                `data: ${JSON.stringify({ type: "text", delta: word + " " })}\n\n`
              ));
              await new Promise(r => setTimeout(r, 15));
            }

            await writer.write(encoder.encode(`data: ${JSON.stringify({ type: "done" })}\n\n`));
            break;
          }
        }
      }
    } catch (err: any) {
      let errorMessage = String(err);
      if (err && typeof err === "object") {
        if (err.error && typeof err.error === "object") {
          const apiErr = err.error;
          if (apiErr.error && typeof apiErr.error === "object" && apiErr.error.message) {
            errorMessage = apiErr.error.message;
          } else if (apiErr.message) {
            errorMessage = apiErr.message;
          }
        } else if (err.message) {
          errorMessage = err.message;
        }
      }
      await writer.write(encoder.encode(
        `data: ${JSON.stringify({ type: "error", message: errorMessage })}\n\n`
      ));
    } finally {
      await writer.close();
    }
  })();

  return new Response(stream.readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive"
    }
  });
}
