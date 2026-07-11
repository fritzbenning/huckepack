import { describe, expect, it } from "vitest";
import { createSpan } from "./createSpan";

describe("createSpan", () => {
  it("should create a span with default length", () => {
    const span = createSpan();
    expect(span).toHaveProperty("start");
    expect(span).toHaveProperty("end");
    expect(span).toHaveProperty("ctxt", 0);
  });

  it("should create a span with specified length", () => {
    const length = 10;
    const span = createSpan(length);

    if (span.end >= span.start) {
      expect(span.end - span.start).toBe(length);
    } else {
      const U32_MAX = 4294967296;
      expect(span.end + U32_MAX - span.start).toBe(length);
    }
  });
});
