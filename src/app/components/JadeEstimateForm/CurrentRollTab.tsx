import { UseFormReturn } from "react-hook-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/Tabs";
import * as F from "../ui/Form";
import { Input } from "../ui/Input";
import ENDPOINT from "@/server/endpoints";
import { z } from "zod";

type Props = {
  form: UseFormReturn<z.infer<(typeof ENDPOINT)["jadeEstimate"]["payload"]>>;
};
const CurrentRollTab = ({ form }: Props) => {
  return (
    <div className="flex items-center space-x-4 rounded-md border p-4">
      <Tabs defaultValue="currentRolls" className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="currentRolls" className="w-full">
            Special Passes
          </TabsTrigger>
          <TabsTrigger value="currentJades" className="w-full">
            Stellar Jades
          </TabsTrigger>
          <TabsTrigger value="dailyRefills" className="w-full">
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
                    <Input className="w-20" type="number" min={0} {...field} />
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
                    <Input className="w-20" type="number" min={0} {...field} />
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
