import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import StatusTimeline from "@/components/ui/StatusTimeline";
import React from "react";

describe("StatusTimeline", () => {
  const timeline = [
    { event: "Order placed", timestamp: "2026-06-02T10:00:00Z" },
    { event: "Confirmed", timestamp: "2026-06-03T10:00:00Z" },
  ];

  it("renders order tracking header", () => {
    render(
      React.createElement(StatusTimeline, {
        status: "confirmed",
        timeline,
      })
    );
    expect(screen.getByText("Order Tracking Status")).toBeInTheDocument();
  });

  it("renders recipient details when provided", () => {
    render(
      React.createElement(StatusTimeline, {
        status: "confirmed",
        timeline,
        recipient: "Nimal Perera",
      })
    );
    expect(screen.getByText("Nimal Perera")).toBeInTheDocument();
  });

  it("renders estimated delivery date correctly formatted", () => {
    render(
      React.createElement(StatusTimeline, {
        status: "confirmed",
        timeline,
        estimatedDelivery: "2026-06-05T12:00:00Z",
      })
    );
    expect(screen.getByText(/Est. Delivery/)).toBeInTheDocument();
    expect(screen.getAllByText(/2026/).length).toBeGreaterThan(0);
  });

  it("renders cancelled status layout correctly", () => {
    render(
      React.createElement(StatusTimeline, {
        status: "cancelled",
        timeline,
      })
    );
    expect(screen.getByText("Order Cancelled")).toBeInTheDocument();
    expect(screen.getByText("This order has been cancelled.")).toBeInTheDocument();
  });
});
