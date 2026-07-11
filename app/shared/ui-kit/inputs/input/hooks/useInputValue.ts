import { useEffect, useState } from "react";
import { useStaleValue } from "../../hooks/useStaleValue";

export function useInputValue(
  value: string | number | undefined,
  onChange?: (value: string) => void,
  instant = false,
  savePrevValue = true
) {
  const staleValueFromHook = useStaleValue(value, (val) => val === undefined || val === null || val === "");
  const staleValue = savePrevValue ? staleValueFromHook : value;

  const [inputValue, setInputValue] = useState(staleValue?.toString() || "");

  useEffect(() => {
    const stringValue = staleValue?.toString() || "";
    setInputValue(stringValue);
  }, [staleValue]);

  const handleChange = (newValue: string) => {
    setInputValue(newValue);
    if (instant && onChange) {
      onChange(newValue);
    }
  };

  const handleSubmit = () => {
    if (onChange && inputValue !== value?.toString()) {
      onChange(inputValue);
    }
  };

  return { inputValue, handleChange, handleSubmit };
}
