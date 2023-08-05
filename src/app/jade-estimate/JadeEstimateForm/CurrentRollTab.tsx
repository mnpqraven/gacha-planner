import { UseFormReturn } from "react-hook-form";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/Tabs";
import * as F from "../../components/ui/Form";
import { Input } from "../../components/ui/Input";
import { JadeEstimateCfg } from "@grpc/jadeestimate_pb";
import { cva } from "class-variance-authority";

type Props = {
  form: UseFormReturn<JadeEstimateCfg>;
};

const CurrentRollTab = ({ form }: Props) => {
  const { errors } = form.formState;

  return (
    <div className="flex items-center space-x-4 rounded-md border p-4">
      <Tabs defaultValue="currentRolls" className="w-full">
        <TabsList className="w-full">
          <TabsTrigger
            value="currentRolls"
            className={triggerVariant("currentRolls", errors)}
          >
            Sp. Passes
          </TabsTrigger>
          <TabsTrigger
            value="currentJades"
            className={triggerVariant("currentJades", errors)}
          >
            Jades
          </TabsTrigger>
          <TabsTrigger
            value="dailyRefills"
            className={triggerVariant("dailyRefills", errors)}
          >
            Daily Refills
          </TabsTrigger>
        </TabsList>

        <TabsContent value="currentRolls">
          <F.FormField
            control={form.control}
            name="currentRolls"
            render={({ field }) => (
              <F.FormItem>
                <div className="flex">
                  <div className="flex-1 space-y-1">
                    <F.FormLabel>Current passes</F.FormLabel>
                    <F.FormDescription>
                      Amount of special passes you currently possess
                    </F.FormDescription>
                  </div>
                  <F.FormControl>
                    <Input
                      className="w-20"
                      type="number"
                      min={0}
                      {...field}
                      onChange={(e) => {
                        if (!Number.isNaN(e.currentTarget.value)) {
                          field.onChange(Number(e.currentTarget.value));
                        } else e.preventDefault();
                      }}
                    />
                  </F.FormControl>
                </div>
                <F.FormMessage />
              </F.FormItem>
            )}
          />
        </TabsContent>

        <TabsContent value="currentJades">
          <F.FormField
            control={form.control}
            name="currentJades"
            render={({ field }) => (
              <F.FormItem>
                <div className="flex">
                  <div className="flex-1 space-y-1">
                    <F.FormLabel>Current jades</F.FormLabel>
                    <F.FormDescription>
                      Amount of jades you currently possess
                    </F.FormDescription>
                  </div>
                  <F.FormControl>
                    <Input
                      className="w-20"
                      type="number"
                      min={0}
                      {...field}
                      onChange={(e) => {
                        if (!Number.isNaN(e.currentTarget.value)) {
                          field.onChange(Number(e.currentTarget.value));
                        } else e.preventDefault();
                      }}
                    />
                  </F.FormControl>
                </div>
                <F.FormMessage />
              </F.FormItem>
            )}
          />
        </TabsContent>

        <TabsContent value="dailyRefills">
          <F.FormField
            control={form.control}
            name="dailyRefills"
            render={({ field }) => (
              <F.FormItem>
                <div className="flex">
                  <div className="flex-1 space-y-1">
                    <F.FormLabel>Daily Refills</F.FormLabel>
                    <F.FormDescription>
                      Amount of refills (using Jades) everyday
                    </F.FormDescription>
                  </div>
                  <F.FormControl>
                    <Input
                      className="w-20"
                      type="number"
                      min={0}
                      max={8}
                      {...field}
                      onChange={(e) => {
                        if (!Number.isNaN(e.currentTarget.value)) {
                          field.onChange(Number(e.currentTarget.value));
                        } else e.preventDefault();
                      }}
                    />
                  </F.FormControl>
                </div>
                <F.FormMessage />
              </F.FormItem>
            )}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export { CurrentRollTab };

function triggerVariant(key: string, errors: object) {
  const variant = cva("w-full", {
    variants: {
      variant: {
        default: "",
        error: "text-destructive data-[state=active]:text-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  });
  return variant({ variant: key in errors ? "error" : "default" });
}
