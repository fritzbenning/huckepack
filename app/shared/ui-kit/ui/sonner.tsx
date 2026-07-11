"use client";
import { useElectron } from "@hooks/application/useElectron";
import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const isElectron = useElectron();

  return (
    <Sonner
      theme="dark"
      style={
        {
          "--normal-bg": "rgba(0, 0, 0, 0.8)",
          "--normal-text": "var(--color-neutral-400)",
          "--normal-border": "transparent",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "backdrop-blur-md shadow-lg/12",
        },
      }}
      position="top-center"
      closeButton={true}
      duration={2000}
      visibleToasts={1}
      offset={isElectron ? 56 : 12}
      {...props}
    />
  );
};

export { Toaster };
