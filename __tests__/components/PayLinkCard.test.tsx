import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import PayLinkCard from "@/components/checkout/PayLinkCard";
import { makeOrder } from "@/__mocks__/test-data-factories";
import React from "react";

describe("PayLinkCard", () => {

  it("renders order ID", () => {
    const order = makeOrder({ order_id: "KP-TEST-001" });
    render(React.createElement(PayLinkCard, {
      orderId:   order.order_id,
      payUrl:    order.pay_url,
      expiresAt: order.expires_at,
      items:     [{ name: "Birthday Cake", quantity: 1, price: 3500 }],
      total:     3500,
      delivery:  350,
    }));
    expect(screen.getByText(/KP-TEST-001/)).toBeInTheDocument();
  });

  it("renders Pay Now button", () => {
    const order = makeOrder();
    render(React.createElement(PayLinkCard, {
      orderId:   order.order_id,
      payUrl:    order.pay_url,
      expiresAt: order.expires_at,
      items:     [],
      total:     3500,
      delivery:  350,
    }));
    expect(screen.getByText(/PAY NOW/i)).toBeInTheDocument();
  });

  it("Pay Now button links to pay_url", () => {
    const order = makeOrder({ pay_url: "https://www.kapruka.com/pay/KP-123" });
    render(React.createElement(PayLinkCard, {
      orderId:   order.order_id,
      payUrl:    order.pay_url,
      expiresAt: order.expires_at,
      items:     [],
      total:     3500,
      delivery:  350,
    }));
    const link = screen.getByRole("link", { name: /PAY NOW/i });
    expect(link).toHaveAttribute("href", "https://www.kapruka.com/pay/KP-123");
  });

  it("renders countdown timer", () => {
    const future = new Date(Date.now() + 3600000).toISOString();
    render(React.createElement(PayLinkCard, {
      orderId:   "KP-1",
      payUrl:    "https://kapruka.com/pay/1",
      expiresAt: future,
      items:     [],
      total:     1000,
      delivery:  350,
    }));
    expect(screen.getByText(/Pay within/i)).toBeInTheDocument();
    // Should show some MM:SS format
    expect(screen.getByText(/\d{2}:\d{2}/)).toBeInTheDocument();
  });

  it("shows expired state when time is up", () => {
    const past = new Date(Date.now() - 1000).toISOString();
    render(React.createElement(PayLinkCard, {
      orderId:   "KP-1",
      payUrl:    "https://kapruka.com/pay/1",
      expiresAt: past,
      items:     [],
      total:     1000,
      delivery:  350,
    }));
    expect(screen.getByText(/expired/i)).toBeInTheDocument();
    // Pay Now should not be visible
    expect(screen.queryByRole("link", { name: /PAY NOW/i })).not.toBeInTheDocument();
  });

  it("renders total including delivery", () => {
    const order = makeOrder();
    render(React.createElement(PayLinkCard, {
      orderId:   order.order_id,
      payUrl:    order.pay_url,
      expiresAt: order.expires_at,
      items:     [{ name: "Cake", quantity: 1, price: 3500 }],
      total:     3850,
      delivery:  350,
    }));
    // Total is 3850
    expect(screen.getByText(/3,850/)).toBeInTheDocument();
  });
});
