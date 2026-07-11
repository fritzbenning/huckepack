import { Plus, PlusIcon } from "@phosphor-icons/react";
import { IconAction } from "@shared/ui-kit/ui/IconAction";
import type React from "react";
import { useState } from "react";

interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  label?: string;
  className?: string;
}

export function TagInput({ value, onChange, placeholder = "Add tag...", label, className = "" }: TagInputProps) {
  const [inputValue, setInputValue] = useState("");

  const addTag = () => {
    const trimmedValue = inputValue.trim();
    if (trimmedValue && !value.includes(trimmedValue)) {
      onChange([...value, trimmedValue]);
      setInputValue("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    onChange(value.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    } else if (e.key === "Backspace" && inputValue === "" && value.length > 0) {
      removeTag(value[value.length - 1]);
    }
  };

  return (
    <div className={className}>
      {label && (
        <label htmlFor="tag-input" className="mb-2 block font-medium text-sm text-neutral-750 dark:text-neutral-300">
          {label}
        </label>
      )}
      <div className="flex min-h-[38px] flex-wrap gap-2 rounded-md border border-neutral-300 bg-white p-2 focus-within:border-transparent focus-within:ring-2 focus-within:ring-primary-500 dark:border-neutral-600 dark:bg-neutral-850">
        {value.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 rounded-md bg-primary-100 px-2 py-1 text-primary-800 text-xs dark:bg-primary-900 dark:text-primary-200"
          >
            {tag}
            <IconAction
              onClick={() => removeTag(tag)}
              size="sm"
              className="text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-200"
            />
          </span>
        ))}
        <div className="flex min-w-[120px] flex-1 items-center gap-1">
          <input
            id="tag-input"
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="flex-1 bg-transparent text-sm text-neutral-950 placeholder-neutral-500 outline-none dark:text-neutral-100 dark:placeholder-neutral-400"
          />
          {inputValue.trim() && (
            <button
              type="button"
              onClick={addTag}
              className="text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-200"
            >
              <PlusIcon className="size-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
