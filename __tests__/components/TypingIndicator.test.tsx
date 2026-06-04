import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import TypingIndicator from "@/components/chat/TypingIndicator";
import React from "react";

describe("TypingIndicator", () => {

  it("does not render when show is false", () => {
    const { container } = render(
      React.createElement(TypingIndicator, { show: false })
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders typing container when show is true", () => {
    render(
      React.createElement(TypingIndicator, { show: true })
    );
    // Should render the 'K' avatar representation or dots
    expect(screen.getByText("K")).toBeInTheDocument();
  });

  it("renders friendly label for specific tool names", () => {
    render(
      React.createElement(TypingIndicator, {
        show: true,
        toolName: "kapruka_search_products",
      })
    );
    expect(screen.getByText("Searching Kapruka catalog...")).toBeInTheDocument();
  });

  it("renders friendly label for create order tool", () => {
    render(
      React.createElement(TypingIndicator, {
        show: true,
        toolName: "kapruka_create_order",
      })
    );
    expect(screen.getByText("Creating your order...")).toBeInTheDocument();
  });

  it("renders fallback default text if tool name is unknown", () => {
    render(
      React.createElement(TypingIndicator, {
        show: true,
        toolName: "unknown_mcp_tool_name",
      })
    );
    expect(screen.getByText("Thinking...")).toBeInTheDocument();
  });
});
