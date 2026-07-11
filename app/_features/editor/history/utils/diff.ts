import { applyPatch, createPatch } from "diff";

export function computeDiff(oldCode: string, newCode: string): string {
  const patch = createPatch("file", oldCode, newCode, "old", "new");
  return patch;
}

export function applyDiff(baseCode: string, diff: string): string {
  const result = applyPatch(baseCode, diff, {
    fuzzFactor: 2,
    autoConvertLineEndings: true,
  });
  if (result === false) {
    console.error("[applyDiff] Failed to apply diff", {
      baseCodeLength: baseCode.length,
      diffLength: diff.length,
      diffPreview: diff.substring(0, 500),
      baseCodePreview: baseCode.substring(0, 500),
    });
    throw new Error("Failed to apply diff");
  }
  return result;
}

export function reconstructCode(baseCode: string, diffs: string[], upToIndex: number): string {
  let code = baseCode;
  for (let i = 0; i <= upToIndex && i < diffs.length; i++) {
    try {
      code = applyDiff(code, diffs[i]);
    } catch (error) {
      console.error(`[reconstructCode] Failed to apply diff at index ${i}`, {
        index: i,
        upToIndex,
        diffsLength: diffs.length,
        currentCodeLength: code.length,
        diffLength: diffs[i]?.length,
        diffPreview: diffs[i]?.substring(0, 200),
      });
      throw error;
    }
  }
  return code;
}

export function computeReverseDiff(currentCode: string, previousCode: string): string {
  const patch = createPatch("file", currentCode, previousCode, "current", "previous");
  return patch;
}

export function applyReverseDiff(currentCode: string, reverseDiff: string): string {
  const result = applyPatch(currentCode, reverseDiff, {
    fuzzFactor: 2,
    autoConvertLineEndings: true,
  });
  if (result === false) {
    console.error("[applyReverseDiff] Failed to apply reverse diff", {
      currentCodeLength: currentCode.length,
      reverseDiffLength: reverseDiff.length,
      reverseDiffPreview: reverseDiff.substring(0, 500),
      currentCodePreview: currentCode.substring(0, 500),
    });
    throw new Error("Failed to apply reverse diff");
  }
  return result;
}

export function reconstructPreviousVersion(currentCode: string, reverseDiffs: string[], stepsBack: number): string {
  let code = currentCode;
  for (let i = 0; i < stepsBack && i < reverseDiffs.length; i++) {
    try {
      code = applyReverseDiff(code, reverseDiffs[i]);
    } catch (error) {
      console.error(`[reconstructPreviousVersion] Failed to apply reverse diff at index ${i}`, {
        index: i,
        stepsBack,
        reverseDiffsLength: reverseDiffs.length,
        currentCodeLength: code.length,
        reverseDiffLength: reverseDiffs[i]?.length,
        reverseDiffPreview: reverseDiffs[i]?.substring(0, 200),
      });
      throw error;
    }
  }
  return code;
}
