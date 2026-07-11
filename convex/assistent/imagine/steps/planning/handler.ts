import type { PlanningInput, WorkflowContext, WorkflowYield } from "../../types";

interface FileItem {
  name: string;
  isPage: boolean;
  dependencies: string[];
  purpose: string;
}

export async function* executePlanning(
  _context: WorkflowContext,
  input: PlanningInput
): AsyncGenerator<WorkflowYield, FileItem[]> {
  const stepId = "planning";

  const stepTitle = {
    inProgress: "Planning file structure...",
    complete: "File structure created",
  };

  yield {
    type: "step",
    text: stepTitle.inProgress,
    stepId,
    status: "in-progress",
    output: "",
  };

  const allFiles: FileItem[] = [
    ...input.architecture.components.map((c) => ({
      name: c.name,
      isPage: false,
      dependencies: c.dependencies,
      purpose: c.purpose,
    })),
    ...input.architecture.pages.map((p) => ({
      name: p.name,
      isPage: true,
      dependencies: p.dependencies,
      purpose: p.purpose,
    })),
  ];

  // Topological sort
  const orderedFiles: FileItem[] = [];
  const processed = new Set<string>();

  const canProcess = (file: FileItem) => {
    return file.dependencies.every((dep) => processed.has(dep));
  };

  while (orderedFiles.length < allFiles.length) {
    const nextFile = allFiles.find((f) => !processed.has(f.name) && canProcess(f));

    if (!nextFile) {
      // Circular dependency or missing dependency - add remaining items
      const remaining = allFiles.filter((f) => !processed.has(f.name));
      orderedFiles.push(...remaining);
      break;
    }

    orderedFiles.push(nextFile);
    processed.add(nextFile.name);
  }

  const componentsCount = orderedFiles.filter((f) => !f.isPage).length;
  const pagesCount = orderedFiles.filter((f) => f.isPage).length;

  yield {
    type: "step",
    text: stepTitle.complete,
    stepId,
    status: "completed",
    output: `Planned ${orderedFiles.length} files: ${componentsCount} components and ${pagesCount} pages`,
  };

  return orderedFiles;
}
