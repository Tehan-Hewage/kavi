import { vi } from "vitest";

export const mockCreate = vi.fn();

const MockAnthropic = vi.fn().mockImplementation(() => {
  return {
    messages: {
      create: mockCreate,
    },
  };
});

// Mock the nested static properties/types if needed
(MockAnthropic as any).Tool = {};

export default MockAnthropic;
