"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useFormStatus } from "react-dom";

interface iAppProps {
  text: string;
  classname?: string;
  variant?:
    | "link"
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | null
    | undefined;
}

export function SubmitButtons({ text, classname, variant }: iAppProps) {
  const { pending } = useFormStatus();
  return (
    <>
      {pending ? (
        <Button variant={variant} disabled className={cn("w-fit", classname)}>
          <Loader2 className="mr-2 animate-spin size-4" /> Please wait...
        </Button>
      ) : (
        <Button
          className={cn("w-fit", classname)}
          variant={variant}
          type="submit"
        >
          {text}
        </Button>
      )}
    </>
  );
}
