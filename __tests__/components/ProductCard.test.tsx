import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import ProductCard from "@/components/products/ProductCard";
import { makeProduct } from "@/__mocks__/test-data-factories";
import { CartProvider } from "@/components/providers/CartProvider";
import { LanguageProvider } from "@/components/providers/LanguageProvider";
import React from "react";

const Providers = ({ children }: { children: React.ReactNode }) =>
  React.createElement(CartProvider, null,
    React.createElement(LanguageProvider, null, children)
  );

const renderCard = (overrides = {}) => {
  const product = makeProduct(overrides);
  const utils = render(
    React.createElement(Providers, null,
      React.createElement(ProductCard, { product, index: 0 })
    )
  );
  return { ...utils, product };
};

describe("ProductCard", () => {

  it("renders product name", () => {
    const { product } = renderCard({ name: "Samsung Galaxy A55" });
    expect(screen.getByText("Samsung Galaxy A55")).toBeInTheDocument();
  });

  it("renders price in LKR format", () => {
    renderCard({ price: 89990 });
    expect(screen.getByText(/Rs 89,990/)).toBeInTheDocument();
  });

  it("renders Add to Cart button", () => {
    renderCard();
    expect(screen.getByRole("button", { name: /Add to Cart/i })).toBeInTheDocument();
  });

  it("shows 'In Cart ✓' after clicking Add to Cart", () => {
    renderCard();
    const btn = screen.getByRole("button", { name: /Add to Cart/i });
    fireEvent.click(btn);
    expect(screen.getByText(/In Cart/)).toBeInTheDocument();
  });

  it("renders product image with alt text", () => {
    const { product } = renderCard({ name: "Birthday Cake" });
    const img = screen.getByAltText("Birthday Cake");
    expect(img).toBeInTheDocument();
  });

  it("renders rating when provided", () => {
    renderCard({ rating: 4.8, review_count: 124 });
    expect(screen.getByText(/4.8/)).toBeInTheDocument();
  });
});
