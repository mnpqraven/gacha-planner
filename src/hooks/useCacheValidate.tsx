import { ToastAction } from "@/app/components/ui/Toast/Toast";
import { useToast } from "@/app/components/ui/Toast/useToast";
import { useEffect, useState } from "react";
import * as z from "zod";

interface Props<T> {
  schema: z.ZodSchema<T>;
  schemaData: T;
  onReload: () => void;
}

export function useCacheValidate<T>({
  schema,
  schemaData,
  onReload,
}: Props<T>) {
  const { toast } = useToast();
  const [pressed, setPressed] = useState(false);

  useEffect(() => {
    const { success } = schema.safeParse(schemaData);

    if (!pressed && !!schemaData && !success) {
      toast({
        variant: "destructive",
        title: "Outdated Local Cache",
        description:
          "The local cache seems to be outdated, this is usually due to an update to the website, if you are seeing this please click the following 'Reload' button.",
        action: (
          <ToastAction
            altText="Reload"
            onClick={() => {
              onReload();
              setPressed(true);
            }}
          >
            Reload
          </ToastAction>
        ),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pressed, schemaData]);
}
