import type { Id } from "@convex/_generated/dataModel";
import { useCombobox } from "@shared/ui-kit/inputs/combobox/useCombobox";
import { useEffect, useId, useRef } from "react";
import { useParams } from "react-router-dom";
import { useSpotlight } from "../hooks/useSpotlight";
import { useSpotlightStore } from "../stores/spotlightStore";
import { SpotlightFooter } from "./SpotlightFooter";
import { SpotlightInput } from "./SpotlightInput";
import { SpotlightList } from "./SpotlightList";

export interface SpotlightProps {
  projectId: Id<"projects">;
}

export function Spotlight({ projectId }: SpotlightProps) {
  const { fileId: fileIdParam } = useParams<{ fileId?: string }>();
  const fileId = fileIdParam ? (fileIdParam as Id<"files">) : undefined;
  const { isOpen, closeSpotlight } = useSpotlightStore();
  const { options, handleNavigate, handleInsert, isComponent } = useSpotlight({ projectId, fileId });
  const spotlightId = useId();
  const listboxId = `${spotlightId}-listbox`;
  const modalRef = useRef<HTMLDivElement>(null);

  const {
    searchValue,
    highlightedIndex,
    inputRef,
    dropdownRef,
    selectOptions,
    setSearchValue,
    handleSelect: handleComboboxSelect,
    handleKeyDown: handleComboboxKeyDown,
    handleInputFocus,
  } = useCombobox({
    options,
    allowCustom: false,
    maxDisplayItems: 100,
  });

  const getSelectedFileId = (): string | null => {
    if (highlightedIndex >= 0 && highlightedIndex < selectOptions.length) {
      return selectOptions[highlightedIndex].value;
    } else if (selectOptions.length > 0) {
      return selectOptions[0].value;
    }
    return null;
  };

  const handleFileNavigate = (value: string) => {
    handleNavigate(value);
    handleComboboxSelect(value);
    closeSpotlight();
    setSearchValue("");
  };

  const handleFileInsert = async (value: string) => {
    await handleInsert(value);
    handleComboboxSelect(value);
    closeSpotlight();
    setSearchValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();
      closeSpotlight();
      setSearchValue("");
      return;
    }

    const selectedFileId = getSelectedFileId();
    if (!selectedFileId) {
      handleComboboxKeyDown(e);
      return;
    }

    const selectedIsComponent = isComponent(selectedFileId);

    if (e.key === "Enter") {
      e.preventDefault();
      e.stopPropagation();

      if (selectedIsComponent && fileId) {
        handleFileInsert(selectedFileId);
      } else {
        handleFileNavigate(selectedFileId);
      }
      return;
    }

    if (e.key === "Tab" && selectedIsComponent && fileId) {
      e.preventDefault();
      e.stopPropagation();
      handleFileNavigate(selectedFileId);
      return;
    }

    handleComboboxKeyDown(e);
  };

  useEffect(() => {
    if (!isOpen) {
      setSearchValue("");
      return;
    }

    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        closeSpotlight();
        setSearchValue("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.body.style.overflow = "hidden";

    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, closeSpotlight, setSearchValue]);

  const activeDescendantId =
    highlightedIndex >= 0 && highlightedIndex < selectOptions.length
      ? `${listboxId}-option-${highlightedIndex}`
      : undefined;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-start justify-center bg-black/50 pt-[20vh] dark:bg-black/75">
      <div
        ref={modalRef}
        className="zoom-in-95 slide-in-from-bottom-4 relative z-10 w-full max-w-2xl animate-in rounded-xl bg-white shadow-2xl duration-200 dark:bg-neutral-900"
      >
        <div className="overflow-hidden rounded-xl">
          <div ref={dropdownRef}>
            <SpotlightInput
              value={searchValue}
              onChange={setSearchValue}
              placeholder="Search files..."
              ref={inputRef}
              onFocus={handleInputFocus}
              onKeyDown={handleKeyDown}
              id={`${spotlightId}-input`}
              role="combobox"
              aria-expanded={true}
              aria-autocomplete="list"
              aria-controls={listboxId}
              aria-activedescendant={activeDescendantId}
              aria-haspopup="listbox"
            />

            {selectOptions.length > 0 && (
              <div className="border-neutral-150 border-t dark:border-neutral-800">
                <SpotlightList
                  items={selectOptions.map((opt) => ({ value: opt.value, label: opt.label }))}
                  highlightedIndex={highlightedIndex}
                  onSelect={(value) => {
                    if (isComponent(value) && fileId) {
                      handleFileInsert(value);
                    } else {
                      handleFileNavigate(value);
                    }
                  }}
                  maxHeight={500}
                  listboxId={listboxId}
                />
              </div>
            )}

            {selectOptions.length === 0 && searchValue.trim() && (
              <div className="border-neutral-200 border-t py-12 text-center text-neutral-500 text-sm dark:border-neutral-850 dark:text-neutral-400">
                No files found.
              </div>
            )}

            {selectOptions.length > 0 && (
              <SpotlightFooter selectedFileId={getSelectedFileId()} isComponent={isComponent} fileId={fileId} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
