"use client";

import { Button } from "@/app/components/ui/Button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/app/components/ui/Tooltip";
import { forwardRef } from "react";
import { Share2 as ShareIcon } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";
import { env } from "@/envSchema.mjs";
import { useToast } from "@/app/components/ui/Toast/useToast";

export const Share = forwardRef(() => {
  const pathname = usePathname();
  const search = useSearchParams();
  const { toast } = useToast();

  function onShare() {
    const lang = search.get("lang");
    let url = env.NEXT_PUBLIC_BASE_URL + pathname;
    if (!!lang) {
      url += `?lang=${lang}`;
    }
    navigator.clipboard
      .writeText(url)
      .then(() => {
        toast({ description: "Url copied successfully" });
      })
      .catch(() => {
        toast({
          description: "Failed to copy Url",
          variant: "destructive",
        });
      });
  }
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline" className="px-2" onClick={onShare}>
          <ShareIcon />
        </Button>
      </TooltipTrigger>
      <TooltipContent>Share</TooltipContent>
    </Tooltip>
  );
});
Share.displayName = "Share";
