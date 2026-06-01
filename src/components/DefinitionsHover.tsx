import * as React from "react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "./ui/hover-card";

interface DefinitionsHoverProps {
  term: string;
  definition: string;
  children: React.ReactNode;
}

export function DefinitionsHover({ term, definition, children }: DefinitionsHoverProps) {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <span className="underline decoration-primary/30 decoration-dashed underline-offset-4 cursor-help hover:decoration-primary transition-colors">
          {children}
        </span>
      </HoverCardTrigger>
      <HoverCardContent className="w-80 text-left">
        <div className="flex justify-between space-x-4">
          <div className="space-y-1">
            <h4 className="text-sm font-bold capitalize">{term}</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {definition}
            </p>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
