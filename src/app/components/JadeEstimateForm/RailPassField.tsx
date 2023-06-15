import ENDPOINT from "@/server/endpoints";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import * as F from "../ui/Form";
import { Switch } from "../ui/Switch";
import { useState } from "react";
import { Separator } from "../ui/Separator";
import { Input } from "../ui/Input";
import { useEffect } from "react";

type Props = {
  form: UseFormReturn<z.infer<(typeof ENDPOINT)["jadeEstimate"]["payload"]>>;
};
const RailPassField = ({ form }: Props) => {
  const [usingRailPass, setUsingRailPass] = useState(false);
  const subscriber = form.watch("railPass.useRailPass");
  useEffect(() => {
    setUsingRailPass(subscriber);
  }, [subscriber]);

  return (
    <div className="rounded-md border p-4">
      <F.FormField
        control={form.control}
        name="railPass.useRailPass"
        render={({ field }) => (
          <F.FormItem>
            <div className="flex items-center">
              <div className="flex-1">
                <F.FormLabel>Rail Pass</F.FormLabel>
                <F.FormDescription>Opt-in</F.FormDescription>
              </div>
              <F.FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={(e) => {
                    setUsingRailPass(e);
                    field.onChange(e);
                  }}
                />
              </F.FormControl>
            </div>
            <F.FormMessage />
          </F.FormItem>
        )}
      />
      {usingRailPass && (
        <>
          <Separator className="my-4" />
          <F.FormField
            control={form.control}
            name="railPass.daysLeft"
            render={({ field }) => (
              <F.FormItem>
                <div className="flex items-center">
                  <div className="flex-1">
                    <F.FormLabel>Days Left</F.FormLabel>
                    <F.FormDescription>
                      You'll receive 300 jades for renewing the subscription
                    </F.FormDescription>
                  </div>
                  <F.FormControl>
                    <Input type="number" {...field} className="w-20" />
                  </F.FormControl>
                </div>
              </F.FormItem>
            )}
          />
        </>
      )}
    </div>
  );
};
export { RailPassField };
