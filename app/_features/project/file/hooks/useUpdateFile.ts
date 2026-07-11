import { api } from "@convex/_generated/api";
import { useMutation } from "convex/react";

export function useUpdateFile() {
  return useMutation(api.files.update).withOptimisticUpdate((localStore, args) => {
    const currentFile = localStore.getQuery(api.files.get, { fileId: args.id });
    if (currentFile !== undefined && currentFile !== null) {
      localStore.setQuery(
        api.files.get,
        { fileId: args.id },
        {
          ...currentFile,
          viewportWidth: args.viewportWidth ?? currentFile.viewportWidth,
          viewportBehavior: args.viewportBehavior ?? currentFile.viewportBehavior,
          name: args.name ?? currentFile.name,
          type: args.type ?? currentFile.type,
          extension: args.extension ?? currentFile.extension,
          code: args.code ?? currentFile.code,
          draft: args.draft ?? currentFile.draft,
          tags: args.tags ?? currentFile.tags,
        }
      );
    }
  });
}
