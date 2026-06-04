import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import CartDrawer from "@/components/cart/CartDrawer";
import { CartProvider } from "@/components/providers/CartProvider";
import { LanguageProvider } from "@/components/providers/LanguageProvider";
import React from "react";

import { CurrencyProvider } from "@/components/providers/CurrencyProvider";

const Providers = ({ children }: { children: React.ReactNode }) =>
  React.createElement(CartProvider, null,
    React.createElement(LanguageProvider, null,
      React.createElement(CurrencyProvider, null, children)
    )
  );

describe("CartDrawer", () => {

  it("does not render drawer when isOpen is false", () => {
    render(
      React.createElement(Providers, null,
        React.createElement(CartDrawer, { isOpen: false, onClose: vi.fn() })
      )
    );
    expect(screen.queryByText(/Your Cart/)).not.toBeInTheDocument();
  });

  it("renders empty cart state when open and empty", () => {
    render(
      React.createElement(Providers, null,
        React.createElement(CartDrawer, { isOpen: true, onClose: vi.fn() })
      )
    );
    expect(screen.getByText(/Your Cart \(0\)/)).toBeInTheDocument();
    expect(screen.getByText(/Your cart is empty/)).toBeInTheDocument();
  });

  it("calls onClose when close button is clicked", () => {
    const onClose = vi.fn();
    render(
      React.createElement(Providers, null,
        React.createElement(CartDrawer, { isOpen: true, onClose })
      )
    );
    const closeBtn = screen.getByRole("button");
    fireEvent.click(closeBtn);
    expect(onClose).toHaveBeenCalled();
  });
});
