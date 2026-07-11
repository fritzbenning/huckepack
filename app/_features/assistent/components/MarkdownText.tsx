import { useSmoothText } from "@convex-dev/agent/react";
import type React from "react";
import type { Components } from "react-markdown";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";

// import { DesignToken } from "./DesignToken";

// const getPropValue = (properties: Record<string, unknown>, key: string): string => {
//   const value = properties[key];
//   if (Array.isArray(value)) {
//     return value[0]?.toString() || "";
//   }
//   if (value === null || value === undefined) {
//     return "";
//   }
//   return value.toString();
// };

// type CustomComponentProps = {
//   node?: {
//     properties?: Record<string, unknown>;
//   };
// };

const markdownComponents = {
  // designtoken: (props: CustomComponentProps) => {
  //   const { node } = props;
  //   const properties = node?.properties || {};

  //   const name = getPropValue(properties, "name") || getPropValue(properties, "title");
  //   const value = getPropValue(properties, "value") || getPropValue(properties, "color");
  //   const type = getPropValue(properties, "type") || "color";

  //   if (name && value) {
  //     return (
  //       <DesignToken
  //         title={name}
  //         type={type as "color" | "typography" | "spacing" | "shadow" | "border" | "radius"}
  //         value={value}
  //         className="my-2"
  //       />
  //     );
  //   }
  //   return null;
  // },
  h1: ({ children }: React.PropsWithChildren) => <h1 className="font-bold text-lg">{children}</h1>,
  h2: ({ children }: React.PropsWithChildren) => <h2 className="font-bold text-md">{children}</h2>,
  h3: ({ children }: React.PropsWithChildren) => <h3 className="font-bold text-base">{children}</h3>,
  h4: ({ children }: React.PropsWithChildren) => <h4 className="font-bold text-sm">{children}</h4>,
  h5: ({ children }: React.PropsWithChildren) => <h5 className="font-bold text-xs">{children}</h5>,
  h6: ({ children }: React.PropsWithChildren) => <h6 className="font-bold text-xs">{children}</h6>,
  p: ({ children }: React.PropsWithChildren) => <p>{children}</p>,
  code: ({ className, children, ...props }: React.ComponentPropsWithoutRef<"code">) => {
    const isInline = !className?.includes("language-");
    return isInline ? (
      <code className="rounded bg-neutral-100 px-1 py-0.5 dark:bg-neutral-900" {...props}>
        {children}
      </code>
    ) : (
      <pre className="overflow-x-auto rounded-md bg-neutral-100 p-3 dark:bg-neutral-900">
        <code className={className} {...props}>
          {children}
        </code>
      </pre>
    );
  },
  ul: ({ children }: React.PropsWithChildren) => (
    <ul className="flex list-inside list-disc flex-col gap-1.5">{children}</ul>
  ),
  ol: ({ children }: React.PropsWithChildren) => (
    <ol className="flex list-inside list-decimal flex-col gap-1.5">{children}</ol>
  ),
  li: ({ children }: React.PropsWithChildren) => <li>{children}</li>,
  blockquote: ({ children }: React.PropsWithChildren) => (
    <blockquote className="border-neutral-300 border-l-4 pl-4 italic dark:border-neutral-600">{children}</blockquote>
  ),
  a: ({ href, children }: React.ComponentPropsWithoutRef<"a">) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-primary-600 hover:underline dark:text-primary-400"
    >
      {children}
    </a>
  ),
};

interface MarkdownTextProps {
  content: string;
}

export const MarkdownText: React.FC<MarkdownTextProps> = ({ content }) => {
  const [smoothText] = useSmoothText(content, {
    startStreaming: false,
  });

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw, rehypeHighlight]}
      components={markdownComponents as Components}
    >
      {smoothText}
    </ReactMarkdown>
  );
};
