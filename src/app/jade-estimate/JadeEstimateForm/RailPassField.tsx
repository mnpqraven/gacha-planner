import { UseFormReturn } from "react-hook-form";
import * as F from "../../components/ui/Form";
import { Switch } from "../../components/ui/Switch";
import { Separator } from "../../components/ui/Separator";
import { Input } from "../../components/ui/Input";
import { JadeEstimateCfg } from "@grpc/jadeestimate_pb";

type Props = {
  form: UseFormReturn<JadeEstimateCfg>;
};
const RailPassField = ({ form }: Props) => {
  const useRailPass = form.watch("railPass.useRailPass");

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
                  onCheckedChange={field.onChange}
                />
              </F.FormControl>
            </div>
            <F.FormMessage />
          </F.FormItem>
        )}
      />
      {useRailPass && (
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
                      You{"'"}ll receive 300 jades for renewing the subscription
                    </F.FormDescription>
                  </div>
                  <F.FormControl>
                    <Input
                      type="number"
                      min={0}
                      {...field}
                      onChange={(e) => {
                        if (!Number.isNaN(e.currentTarget.value)) {
                          field.onChange(Number(e.currentTarget.value));
                        } else e.preventDefault();
                      }}
                      className="w-20"
                    />
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
