import { Heading } from "@shared/ui-kit/typo";
import GradientBorder from "@shared/ui-kit/ui/GradientBorder";
import { Illustration } from "@shared/ui-kit/ui/Illustration";
import { Jumbotron } from "@shared/ui-kit/ui/Jumbotron";
import type React from "react";

export interface JumbotronSectionProps {
  headline: string;
  illustration: "rocket" | "university";
  children: React.ReactNode;
  gradientBorder?: boolean;
  jumbotronPadding?: "small" | "medium" | "large";
  jumbotronClassName?: string;
}

export const JumbotronSection = ({
  headline,
  illustration,
  children,
  gradientBorder = false,
  jumbotronPadding = "large",
  jumbotronClassName,
}: JumbotronSectionProps) => {
  const jumbotronContent = (
    <Jumbotron padding={jumbotronPadding} className={jumbotronClassName} border={false}>
      {children}
    </Jumbotron>
  );

  return (
    <div className="space-y-7">
      <Heading as="h1" variant="h1" className="flex items-center gap-4 text-neutral-850 dark:text-neutral-200">
        <Illustration name={illustration} size="sm" />
        {headline}
      </Heading>
      {gradientBorder ? (
        <GradientBorder borderRadius="rounded-[19px]">{jumbotronContent}</GradientBorder>
      ) : (
        jumbotronContent
      )}
    </div>
  );
};
