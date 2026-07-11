import { cn } from "@lib/utils";
import type { Icon } from "@phosphor-icons/react";
import { cva, type VariantProps } from "class-variance-authority";
import type React from "react";
import { useEffect, useRef } from "react";
import { IconAction } from "./IconAction";

const modalVariants = cva(
  "zoom-in-95 slide-in-from-bottom-4 relative z-10 w-full animate-in rounded-lg bg-white shadow-xl duration-200 dark:bg-neutral-850",
  {
    variants: {
      size: {
        sm: "max-w-sm",
        md: "max-w-md",
        lg: "max-w-2xl",
        xl: "max-w-4xl",
        full: "mx-4 max-w-full",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

export interface ModalProps extends VariantProps<typeof modalVariants> {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  icon?: Icon;
  children: React.ReactNode;
  className?: string;
  overlayClassName?: string;
  showCloseButton?: boolean;
  contentPadding?: boolean;
  showGradient?: boolean;
  gradientColors?: {
    color1?: [number, number, number]; // RGB values from 0-1
    color2?: [number, number, number];
    color3?: [number, number, number];
  };
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  icon,
  children,
  size,
  className = "",
  overlayClassName = "",
  showCloseButton = true,
  contentPadding = true,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const IconComponent = icon || null;

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  return (
    <>
      {isOpen && (
        <div
          className={cn(
            "fixed inset-0 z-100 flex items-center justify-center bg-black/50 p-4 dark:bg-black/75",
            overlayClassName
          )}
        >
          <div ref={modalRef} className={cn(modalVariants({ size }), className)}>
            {(title || showCloseButton) && (
              <div className="flex items-center justify-between border-neutral-200/75 border-b px-5 py-4 text-neutral-950 dark:border-neutral-750 dark:text-neutral-100">
                <div className="flex gap-2">
                  {IconComponent && <IconComponent className="size-4" weight="duotone" />}
                  {title && <h3 className="font-semibold text-sm">{title}</h3>}
                </div>
                {showCloseButton && <IconAction onClick={onClose} size="md" />}
              </div>
            )}

            <div className={cn(contentPadding && "p-5")}>{children}</div>
          </div>
        </div>
      )}
    </>
  );
};
