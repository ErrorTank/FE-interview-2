import { describe, it, expect } from "vitest";
import { sumToN_A, sumToN_B, sumToN_C } from "./test-1";

describe("Sum to N", () => {
  const attempts = [
    { fn: sumToN_A, name: "Approach A" },
    { fn: sumToN_B, name: "Approach B" },
    { fn: sumToN_C, name: "Approach C" },
  ];

  attempts.forEach(({ fn, name }) => {
    describe(name, () => {
      it("should handle normal positive numbers", () => {
        expect(fn(5)).toBe(15);
        expect(fn(1)).toBe(1);
        expect(fn(10)).toBe(55);
      });

      it("should handle zero", () => {
        expect(fn(0)).toBe(0);
      });

      it("should handle negative numbers by returning 0", () => {
        expect(fn(-1)).toBe(0);
        expect(fn(-100)).toBe(0);
      });

      it("should handle non-integer numbers by returning 0", () => {
        expect(fn(3.5)).toBe(0);
        expect(fn(2.7)).toBe(0);
      });

      it("should handle very large numbers within safe integer range", () => {
        expect(fn(1000)).toBe(500500);
      });

      it("should handle MAX_SAFE_INTEGER overflow", () => {
        const hugeNumber = Number.MAX_SAFE_INTEGER;
        expect(fn(hugeNumber)).toBe(Number.MAX_SAFE_INTEGER);
      });

      it("should handle NaN by returning 0", () => {
        expect(fn(NaN)).toBe(0);
      });
    });
  });

  it("should return identical results across all implementations", () => {
    const testCases = [0, 1, 5, 10, 100, 1000];

    testCases.forEach((n) => {
      const results = [sumToN_A(n), sumToN_B(n), sumToN_C(n)];
      expect(new Set(results).size).toBe(1);
    });
  });
});
