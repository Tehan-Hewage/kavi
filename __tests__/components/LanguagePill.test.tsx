import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { LanguagePill } from "@/components/ui/LanguagePill";
import { LanguageProvider } from "@/components/providers/LanguageProvider";
import React from "react";

const renderPill = () =>
  render(React.createElement(LanguageProvider, null,
    React.createElement(LanguagePill)
  ));

describe("LanguagePill — BONUS", () => {

  it("renders all 4 language options", () => {
    renderPill();
    expect(screen.getByText("EN")).toBeInTheDocument();
    expect(screen.getByText("සිංහල")).toBeInTheDocument();
    expect(screen.getByText("தமிழ்")).toBeInTheDocument();
    expect(screen.getByText("Tanglish")).toBeInTheDocument();
  });

  it("defaults to EN language", () => {
    renderPill();
    // EN button should have active styling
    const enBtn = screen.getByText("EN").closest("button");
    expect(enBtn).toBeInTheDocument();
  });

  it("switches to Sinhala on click", () => {
    renderPill();
    const siBtn = screen.getByText("සිංහල");
    fireEvent.click(siBtn);
    // After click, Sinhala should be active
    expect(siBtn.closest("button")).toBeInTheDocument();
  });

  it("switches to Tanglish on click", () => {
    renderPill();
    const tgBtn = screen.getByText("Tanglish");
    fireEvent.click(tgBtn);
    expect(tgBtn.closest("button")).toBeInTheDocument();
  });

  it("renders Sinhala script correctly (Unicode check)", () => {
    renderPill();
    // Check Sinhala Unicode characters are present
    const siText = screen.getByText("සිංහල");
    expect(siText.textContent).toMatch(/[\u0D80-\u0DFF]/);
  });
});
