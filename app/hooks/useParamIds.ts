import type { Id } from "@convex/_generated/dataModel";
import { useParams } from "react-router-dom";

export function useParamIds() {
  const { projectId: projectIdParam, fileId: fileIdParam } = useParams<{ projectId: string; fileId: string }>();

  const projectId = projectIdParam ? (projectIdParam as Id<"projects">) : undefined;
  const fileId = fileIdParam ? (fileIdParam as Id<"files">) : undefined;

  return { projectId, fileId };
}

