import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import SuggestionChips from "@/components/ui/SuggestionChips";
import React from "react";

describe("SuggestionChips", () => {
  const chips = [
    { label: "Birthday cakes", icon: "🎂", message: "Show me birthday cakes" },
    { label: "Send flowers", icon: "💐", message: "I want to send flowers" },
  ];

  it("renders suggestion labels and icons", () => {
    render(
      React.createElement(SuggestionChips, {
        chips,
        onSelect: vi.fn(),
      })
    );
    expect(screen.getByText("Birthday cakes")).toBeInTheDocument();
    expect(screen.getByText("🎂")).toBeInTheDocument();
    expect(screen.getByText("Send flowers")).toBeInTheDocument();
    expect(screen.getByText("💐")).toBeInTheDocument();
  });

  it("calls onSelect with message when a chip is clicked", () => {
    const onSelect = vi.fn();
    render(
      React.createElement(SuggestionChips, {
        chips,
        onSelect,
      })
    );
    const chipBtn = screen.getByText("Birthday cakes");
    fireEvent.click(chipBtn);
    expect(onSelect).toHaveBeenCalledWith("Show me birthday cakes");
  });
});
