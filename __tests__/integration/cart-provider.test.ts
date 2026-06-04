import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { CartProvider, useCart } from "@/components/providers/CartProvider";
import { makeCartItem } from "@/__mocks__/test-data-factories";
import React from "react";

const wrapper = ({ children }: { children: React.ReactNode }) =>
  React.createElement(CartProvider, null, children);

describe("CartProvider", () => {

  it("starts with empty cart", () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    expect(result.current.cart).toHaveLength(0);
    expect(result.current.cartSubtotal).toBe(0);
  });

  it("adds an item to cart", () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    const item = makeCartItem({ price: 3500 });
    act(() => result.current.addItem(item));
    expect(result.current.cart).toHaveLength(1);
    expect(result.current.cart[0].name).toBe(item.name);
  });

  it("increments quantity when same item added twice", () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    const item = makeCartItem({ product_id: "same-id", price: 1000 });
    act(() => result.current.addItem(item));
    act(() => result.current.addItem(item));
    expect(result.current.cart).toHaveLength(1);
    expect(result.current.cart[0].quantity).toBe(2);
  });

  it("calculates total correctly", () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => result.current.addItem(makeCartItem({ id: "a", price: 3500, quantity: 1 })));
    act(() => result.current.addItem(makeCartItem({ id: "b", price: 1500, quantity: 2 })));
    expect(result.current.cartSubtotal).toBe(3500 + 3000); // 1500 × 2
  });

  it("removes an item from cart", () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    const item = makeCartItem({ id: "remove-me" });
    act(() => result.current.addItem(item));
    act(() => result.current.removeItem("remove-me"));
    expect(result.current.cart).toHaveLength(0);
  });

  it("updates quantity of an item", () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    const item = makeCartItem({ id: "qty-test", quantity: 1 });
    act(() => {
      result.current.addItem(item);
    });
    act(() => {
      result.current.updateQuantity("qty-test", 5);
    });
    expect(result.current.cart[0].quantity).toBe(5);
  });

  it("clears entire cart", () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => result.current.addItem(makeCartItem({ id: "x" })));
    act(() => result.current.addItem(makeCartItem({ id: "y" })));
    act(() => result.current.clearCart());
    expect(result.current.cart).toHaveLength(0);
    expect(result.current.cartSubtotal).toBe(0);
  });

  it("supports multi-item cart — BONUS", () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    const items = Array.from({ length: 5 }, (_, i) =>
      makeCartItem({ id: `item-${i}`, price: 1000 })
    );
    items.forEach(item => act(() => result.current.addItem(item)));
    expect(result.current.cart).toHaveLength(5);
    expect(result.current.cartSubtotal).toBe(5000);
  });
});
