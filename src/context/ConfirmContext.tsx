import React, { createContext, useContext, useState, useCallback } from "react";
import ConfirmDialog, { AlertType } from "../components/ConfirmDialog";

interface ConfirmOptions {
  type?: AlertType;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDanger?: boolean;
}

interface ConfirmContextType {
  showConfirm: (options: ConfirmOptions) => Promise<boolean>;
  showAlert: (type: AlertType, title: string, message: string) => Promise<void>;
}

const ConfirmContext = createContext<ConfirmContextType | undefined>(undefined);

export function ConfirmProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [config, setConfig] = useState<ConfirmOptions>({
    type: "alert",
    title: "",
    message: "",
  });
  const [resolver, setResolver] = useState<((value: boolean) => void) | null>(null);

  const showConfirm = useCallback(
    (options: ConfirmOptions): Promise<boolean> => {
      return new Promise((resolve) => {
        setConfig({
          type: options.type || "confirm",
          ...options,
        });
        setResolver(() => resolve);
        setIsOpen(true);
        setIsLoading(false);
      });
    },
    []
  );

  const showAlert = useCallback(
    (type: AlertType, title: string, message: string): Promise<void> => {
      return new Promise((resolve) => {
        setConfig({
          type,
          title,
          message,
          confirmLabel: "OK",
        });
        setResolver(() => () => resolve());
        setIsOpen(true);
        setIsLoading(false);
      });
    },
    []
  );

  const handleConfirm = async () => {
    setIsLoading(true);
    if (resolver) {
      resolver(true);
    }
    setIsOpen(false);
    setIsLoading(false);
  };

  const handleCancel = () => {
    if (resolver) {
      resolver(false);
    }
    setIsOpen(false);
    setIsLoading(false);
  };

  return (
    <ConfirmContext.Provider value={{ showConfirm, showAlert }}>
      {children}
      <ConfirmDialog
        isOpen={isOpen}
        type={config.type || "alert"}
        title={config.title}
        message={config.message}
        confirmLabel={config.confirmLabel || "Confirm"}
        cancelLabel={config.cancelLabel || "Cancel"}
        isDanger={config.isDanger}
        isLoading={isLoading}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </ConfirmContext.Provider>
  );
}

export function useConfirm() {
  const context = useContext(ConfirmContext);
  if (!context) {
    throw new Error("useConfirm must be used within ConfirmProvider");
  }
  return context;
}
