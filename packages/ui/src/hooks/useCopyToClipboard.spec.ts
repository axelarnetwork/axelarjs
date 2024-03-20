import { act, renderHook } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

import { useCopyToClipboard } from "./useCopyToClipboard";

describe("useCopyToClipboard", () => {
  beforeEach(() => {
    vi.useFakeTimers();

    userEvent.setup();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.resetAllMocks();
  });

  it("copies the given text to clipboard and updates the copiedText state", async () => {
    const { result, rerender } = renderHook(useCopyToClipboard);
    const [copiedText, copy] = result.current;

    expect(copiedText).toBe(null);

    const textToCopy = "test text";
    const success = await act(() => copy(textToCopy));

    expect(success).toBe(true);
    const [updatedCopiedText] = result.current;
    expect(updatedCopiedText).toBe(textToCopy);

    vi.advanceTimersByTime(3000);

    rerender();

    const [resetCopiedText] = result.current;
    expect(resetCopiedText).toBe(null);
  });

  it("handles clipboard write failure", async () => {
    vi.spyOn(navigator.clipboard, "writeText").mockRejectedValue(
      new Error("Copy failed"),
    );

    const { result } = renderHook(useCopyToClipboard);
    const [, copy] = result.current;

    const textToCopy = "test text";
    const success = await act(() => copy(textToCopy));

    expect(success).toBe(false);
    const [failedCopiedText] = result.current;
    expect(failedCopiedText).toBe(null);
  });
});
