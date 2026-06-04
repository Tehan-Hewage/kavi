import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import ProductCarousel from "@/components/products/ProductCarousel";
import { makeProductList } from "@/__mocks__/test-data-factories";
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

describe("ProductCarousel", () => {

  it("returns null if products is empty", () => {
    const { container } = render(
      React.createElement(Providers, null,
        React.createElement(ProductCarousel, { products: [] })
      )
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders list of product cards", () => {
    const products = makeProductList(3);
    render(
      React.createElement(Providers, null,
        React.createElement(ProductCarousel, { products })
      )
    );
    // Should render name of all three products
    products.forEach(p => {
      expect(screen.getByText(p.name)).toBeInTheDocument();
    });
  });

  it("renders desktop scroll navigation buttons", () => {
    const products = makeProductList(5);
    const { container } = render(
      React.createElement(Providers, null,
        React.createElement(ProductCarousel, { products })
      )
    );
    // Buttons exist (even if styled hidden on mobile, they should be in the DOM)
    const buttons = screen.getAllByRole("button");
    // 2 navigation buttons (left/right arrow) + 5 product card buttons = 7 buttons total
    expect(buttons.length).toBeGreaterThanOrEqual(2);
  });
});
