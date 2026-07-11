import { DesignToken } from "./DesignToken";

interface DesignTokenData {
  name: string;
  value: string;
  type: "color" | "typography" | "spacing" | "shadow" | "border" | "radius";
  description?: string;
}

interface DesignTokenStackProps {
  tokens: DesignTokenData[];
  className?: string;
}

export function DesignTokenStack({ tokens, className = "" }: DesignTokenStackProps) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {tokens.map((token, index) => (
        <DesignToken
          key={`${token.name}-${index}`}
          title={token.name}
          type={token.type}
          value={token.value}
          className="my-0"
        />
      ))}
    </div>
  );
}

