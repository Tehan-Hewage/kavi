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
    description: "Search the live Kapruka catalog. IMPORTANT: When the user states a budget, ALWAYS pass min_price and max_price. Example: budget \"8k-10k\" → min_price: 8000, max_price: 10000",
    input_schema: {
      type: "object",
      properties: {
        q:            { type: "string",  description: "Search keyword" },
        category:     { type: "string",  description: "Category slug" },
        min_price:    { type: "number",  description: "Minimum price in LKR — use when user gives a budget" },
        max_price:    { type: "number",  description: "Maximum price in LKR — use when user gives a budget" },
        in_stock_only:{ type: "boolean", description: "Only show available items" },
        sort:         { type: "string",  description: "price_asc | price_desc | popular" },
        limit:        { type: "number",  description: "Results per page, max 20" },
        cursor:       { type: "string",  description: "Pagination cursor" },
        currency:     { type: "string",  description: "LKR (default)" },
      },
      required: ["q"]
    }
  },
  {
    name: "kapruka_list_categories",
    description: "List top-level Kapruka product categories by name. Use category names to filter search query.",
    input_schema: {
      type: "object",
      properties: {
        depth: { type: "number", description: "Sub-category levels to include (1 or 2, default 1)" }
      }
    }
  },
  {
    name: "kapruka_get_product",
    description: "Fetch full details, description, images, price, and variants for a single Kapruka product by its product ID.",
    input_schema: {
      type: "object",
      properties: {
        product_id: { type: "string", description: "Kapruka product ID, e.g. 'cake00ka002034'" }
      },
      required: ["product_id"]
    }
  },
  {
    name: "kapruka_check_delivery",
    description: "Check delivery availability, flat rate (LKR), and perishable alerts to a city on a specific date. Always check this before booking an order.",
    input_schema: {
      type: "object",
      properties: {
        city: { type: "string", description: "Canonical city name. Examples: 'Colombo 03', 'Galle', 'Anuradhapura'." },
        delivery_date: { type: "string", description: "Target delivery date in ISO format (YYYY-MM-DD), Sri Lanka time." },
        product_id: { type: "string", description: "Optional product ID, triggers perishable warnings for cakes/flowers." }
      },
      required: ["city", "delivery_date"]
    }
  },
  {
    name: "kapruka_list_delivery_cities",
    description: "List or search valid Sri Lankan delivery cities. Use this to lookup canonical city names.",
    input_schema: {
      type: "object",
      properties: {
        query: { type: "string", description: "Partial match filter (e.g. 'colombo'). Pass empty string to list all." },
        limit: { type: "number", description: "Max results (1-50, default 25)" }
      },
      required: ["query"]
    }
  },
  {
    name: "kapruka_create_order",
    description: "Create a guest-checkout order on Kapruka and return a click-to-pay URL. Collect cart items, recipient name/phone/address/city, delivery date, and sender name before calling this.",
    input_schema: {
      type: "object",
      properties: {
        cart: {
          type: "array",
          description: "List of items in the cart.",
          items: {
            type: "object",
            properties: {
              product_id: { type: "string", description: "Kapruka product ID" },
              quantity:   { type: "number", description: "Quantity (default 1)" },
              variant_id: { type: "string", description: "Optional variant ID for size/colour variants" },
              icing_text: { type: "string", description: "Optional cake writing text" }
            },
            required: ["product_id"]
          }
        },
        recipient: {
          type: "object",
          description: "Person who receives the delivery.",
          properties: {
            name:    { type: "string", description: "Recipient full name" },
            phone:   { type: "string", description: "Recipient phone number" },
            address: { type: "string", description: "Delivery street address" },
            city:    { type: "string", description: "Canonical city name (use kapruka_list_delivery_cities to verify)" }
          },
          required: ["name", "phone", "address", "city"]
        },
        delivery: {
          type: "object",
          description: "Delivery timing.",
          properties: {
            date:         { type: "string", description: "Delivery date (YYYY-MM-DD)" },
            instructions: { type: "string", description: "Optional special instructions" }
          },
          required: ["date"]
        },
        sender: {
          type: "object",
          description: "Person placing the order (shown on gift card).",
          properties: {
            name:      { type: "string", description: "Sender name shown on card" },
            email:     { type: "string", description: "Sender email for order confirmation" },
            phone:     { type: "string", description: "Sender phone number" },
            anonymous: { type: "boolean", description: "Hide sender identity from recipient" }
          },
          required: ["name"]
        },
        gift_message: { type: "string", description: "Optional gift card message (max 300 chars)" },
        currency:     { type: "string", description: "Currency code, default LKR" }
      },
      required: ["cart", "recipient", "delivery", "sender"]
    }
  },
  {
    name: "kapruka_track_order",
    description: "Look up status and delivery progress for a paid Kapruka order using the order number.",
    input_schema: {
      type: "object",
      properties: {
        order_number: { type: "string", description: "Order number from confirmation email (e.g. 'VIMP34456CB2')." }
      },
      required: ["order_number"]
    }
  }
];

// Tool definitions passed to Gemini (requires uppercase type definitions)
const GEMINI_TOOLS = [
  {
    name: "kapruka_search_products",
    description: "Search the live Kapruka catalog. IMPORTANT: When the user states a budget, ALWAYS pass min_price and max_price. Example: budget \"8k-10k\" → min_price: 8000, max_price: 10000",
    parameters: {
      type: "OBJECT",
      properties: {
        q:            { type: "STRING",  description: "Search keyword" },
        category:     { type: "STRING",  description: "Category slug" },
        min_price:    { type: "NUMBER",  description: "Minimum price in LKR — use when user gives a budget" },
        max_price:    { type: "NUMBER",  description: "Maximum price in LKR — use when user gives a budget" },
        in_stock_only:{ type: "BOOLEAN", description: "Only show available items" },
        sort:         { type: "STRING",  description: "price_asc | price_desc | popular" },
        limit:        { type: "NUMBER",  description: "Results per page, max 20" },
        cursor:       { type: "STRING",  description: "Pagination cursor" },
        currency:     { type: "STRING",  description: "LKR (default)" },
      },
      required: ["q"]
    }
  },
  {
    name: "kapruka_list_categories",
    description: "List top-level Kapruka product categories by name. Use category names to filter search query.",
    parameters: {
      type: "OBJECT",
      properties: {
        depth: { type: "NUMBER", description: "Sub-category levels to include (1 or 2, default 1)" }
      }
    }
  },
  {
    name: "kapruka_get_product",
    description: "Fetch full details, description, images, price, and variants for a single Kapruka product by its product ID.",
    parameters: {
      type: "OBJECT",
      properties: {
        product_id: { type: "STRING", description: "Kapruka product ID, e.g. 'cake00ka002034'" }
      },
      required: ["product_id"]
    }
  },
  {
    name: "kapruka_check_delivery",
    description: "Check delivery availability, flat rate (LKR), and perishable alerts to a city on a specific date. Always check this before booking an order.",
    parameters: {
      type: "OBJECT",
      properties: {
        city:          { type: "STRING", description: "Canonical city name. Examples: 'Colombo 03', 'Galle', 'Anuradhapura'." },
        delivery_date: { type: "STRING", description: "Target delivery date in ISO format (YYYY-MM-DD), Sri Lanka time." },
        product_id:    { type: "STRING", description: "Optional product ID, triggers perishable warnings for cakes/flowers." }
      },
      required: ["city", "delivery_date"]
    }
  },
  {
    name: "kapruka_list_delivery_cities",
    description: "List or search valid Sri Lankan delivery cities. Use this to lookup canonical city names.",
    parameters: {
      type: "OBJECT",
      properties: {
        query: { type: "STRING", description: "Partial match filter (e.g. 'colombo'). Pass empty string to list all." },
        limit: { type: "NUMBER", description: "Max results (1-50, default 25)" }
      },
      required: ["query"]
    }
  },
  {
    name: "kapruka_create_order",
    description: "Create a guest-checkout order on Kapruka and return a click-to-pay URL. Collect cart items, recipient name/phone/address/city, delivery date, and sender name before calling this.",
    parameters: {
      type: "OBJECT",
      properties: {
        cart: {
          type: "ARRAY",
          description: "List of items in the cart.",
          items: {
            type: "OBJECT",
            properties: {
              product_id: { type: "STRING", description: "Kapruka product ID" },
              quantity:   { type: "NUMBER", description: "Quantity (default 1)" },
              variant_id: { type: "STRING", description: "Optional variant ID for size/colour variants" },
              icing_text: { type: "STRING", description: "Optional cake writing text" }
            },
            required: ["product_id"]
          }
        },
        recipient: {
          type: "OBJECT",
          description: "Person who receives the delivery.",
          properties: {
            name:    { type: "STRING", description: "Recipient full name" },
            phone:   { type: "STRING", description: "Recipient phone number" },
            address: { type: "STRING", description: "Delivery street address" },
            city:    { type: "STRING", description: "Canonical city name (use kapruka_list_delivery_cities to verify)" }
          },
          required: ["name", "phone", "address", "city"]
        },
        delivery: {
          type: "OBJECT",
          description: "Delivery timing.",
          properties: {
            date:         { type: "STRING", description: "Delivery date (YYYY-MM-DD)" },
            instructions: { type: "STRING", description: "Optional special instructions" }
          },
          required: ["date"]
        },
        sender: {
          type: "OBJECT",
          description: "Person placing the order (shown on gift card).",
          properties: {
            name:      { type: "STRING", description: "Sender name shown on card" },
            email:     { type: "STRING", description: "Sender email for order confirmation" },
            phone:     { type: "STRING", description: "Sender phone number" },
            anonymous: { type: "BOOLEAN", description: "Hide sender identity from recipient" }
          },
          required: ["name"]
        },
        gift_message: { type: "STRING", description: "Optional gift card message (max 300 chars)" },
        currency:     { type: "STRING", description: "Currency code, default LKR" }
      },
      required: ["cart", "recipient", "delivery", "sender"]
    }
  },
  {
    name: "kapruka_track_order",
    description: "Look up status and delivery progress for a paid Kapruka order using the order number.",
    parameters: {
      type: "OBJECT",
      properties: {
        order_number: { type: "STRING", description: "Order number from confirmation email (e.g. 'VIMP34456CB2')." }
      },
      required: ["order_number"]
    }
  }
];

export async function POST(req: NextRequest) {
  const { messages, language, cart } = await req.json();
  
  const systemPrompt = buildSystemPrompt(language, cart || []);

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
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=${process.env.GEMINI_API_KEY}`,
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
