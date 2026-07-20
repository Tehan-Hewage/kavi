import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ChatInput from "@/components/chat/ChatInput";
import { LanguageProvider } from "@/components/providers/LanguageProvider";
import React from "react";

const renderInput = (onSend = vi.fn(), disabled = false) =>
  render(React.createElement(LanguageProvider, null,
    React.createElement(ChatInput, { onSend, disabled })
  ));

describe("ChatInput", () => {

  it("renders textarea", () => {
    renderInput();
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("renders send button", () => {
    renderInput();
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("calls onSend when Enter is pressed", async () => {
    const onSend = vi.fn();
    renderInput(onSend);
    const textarea = screen.getByRole("textbox");
    await userEvent.type(textarea, "I want a birthday cake{Enter}");
    expect(onSend).toHaveBeenCalledWith("I want a birthday cake");
  });

  it("does NOT send on Shift+Enter (newline)", async () => {
    const onSend = vi.fn();
    renderInput(onSend);
    const textarea = screen.getByRole("textbox");
    await userEvent.type(textarea, "line one{Shift>}{Enter}{/Shift}line two");
    expect(onSend).not.toHaveBeenCalled();
  });

  it("clears input after sending", async () => {
    const onSend = vi.fn();
    renderInput(onSend);
    const textarea = screen.getByRole("textbox");
    await userEvent.type(textarea, "test message{Enter}");
    expect(textarea).toHaveValue("");
  });

  it("send button is disabled when input is empty", () => {
    renderInput();
    const btn = screen.getByRole("button");
    expect(btn).toBeDisabled();
  });

  it("send button is disabled while loading", () => {
    renderInput(vi.fn(), true);
    const btn = screen.getByRole("button");
    expect(btn).toBeDisabled();
  });

  it("does not send when loading is true", async () => {
    const onSend = vi.fn();
    renderInput(onSend, true);
    const textarea = screen.getByRole("textbox");
    await userEvent.type(textarea, "test{Enter}");
    expect(onSend).not.toHaveBeenCalled();
  });
});
