import { HELPER_PREFIXES } from "../constants";

interface ClassLabelProps {
  token: string;
}

export function ClassLabel({ token }: ClassLabelProps) {
  for (const prefix of HELPER_PREFIXES) {
    if (token.startsWith(prefix)) {
      return (
        <>
          <span className="font-bold opacity-50">{prefix}</span>
          {token.slice(prefix.length)}
        </>
      );
    }
  }
  return <>{token}</>;
}
