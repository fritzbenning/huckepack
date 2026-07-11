import type React from "react";

interface DesignRuleInputRowProps {
  children: React.ReactNode;
  className?: string;
}

const DesignRuleInputRow: React.FC<DesignRuleInputRowProps> = ({ children, className = "" }) => {
  return <div className={`flex flex-2 items-start gap-1.5 ${className}`.trim()}>{children}</div>;
};

export default DesignRuleInputRow;

