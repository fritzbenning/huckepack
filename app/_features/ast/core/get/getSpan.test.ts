import { describe, expect, it } from "vitest";
import { getSpan } from "./getSpan";
import type { Span } from "@swc/wasm-web";

describe("getSpan", () => {
  it("should return the span if the object has a valid span property", () => {
    const mockSpan: Span = { start: 10, end: 20, ctxt: 0 };
    const node = { span: mockSpan, otherProp: "test" };
    expect(getSpan(node)).toEqual(mockSpan);
  });

  it("should return a default span if the object does not have a span property", () => {
    const node = { otherProp: "test" };
    expect(getSpan(node)).toEqual({ start: 0, end: 0, ctxt: 0 });
  });

  it("should return a default span if the input is null or undefined", () => {
    expect(getSpan(null)).toEqual({ start: 0, end: 0, ctxt: 0 });
    expect(getSpan(undefined)).toEqual({ start: 0, end: 0, ctxt: 0 });
  });

  it("should return a default span if the input is not an object", () => {
    expect(getSpan("string")).toEqual({ start: 0, end: 0, ctxt: 0 });
    expect(getSpan(123)).toEqual({ start: 0, end: 0, ctxt: 0 });
  });
});
