import { useLibraryStore } from "../stores/libraryStore";

export function useFileView() {
  const fileView = useLibraryStore((state) => state.fileView);
  const setFileView = useLibraryStore((state) => state.setFileView);

  return {
    view: fileView,
    setView: setFileView,
  };
}
