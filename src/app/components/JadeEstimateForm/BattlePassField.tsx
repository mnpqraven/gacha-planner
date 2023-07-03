import ENDPOINT from "@/server/endpoints";
import { UseFormReturn } from "react-hook-form";
import * as F from "../ui/Form";
import * as S from "../ui/Select";
import { z } from "zod";
import { Separator } from "../ui/Separator";
import { Input } from "../ui/Input";

type Props = {
  form: UseFormReturn<z.infer<(typeof ENDPOINT)["jadeEstimate"]["payload"]>>;
};

const BattlePassField = ({ form }: Props) => {
  const usingBP = form.watch("battlePass.battlePassType");

  return (
    <div className="rounded-md border p-4">
      <F.FormField
        control={form.control}
        name="battlePass.battlePassType"
        render={({ field }) => (
          <F.FormItem>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
              <div className="sm:w-3/4 space-y-1">
                <F.FormLabel>Nameless Honor</F.FormLabel>
                <F.FormDescription className="text-justify">
                  If not selecting F2P, this assumes you{"'"}ve received the
                  current patch{"'"}s first time purchase rewards and those won
                  {"'"}t be calculated.
                </F.FormDescription>
              </div>
              <S.Select
                onValueChange={field.onChange}
                value={String(form.watch("battlePass.battlePassType"))}
                defaultValue={field.value}
              >
                <F.FormControl>
                  <S.SelectTrigger className="max-w-fit">
                    <S.SelectValue />
                  </S.SelectTrigger>
                </F.FormControl>
                <S.SelectContent>
                  <S.SelectItem value="None">F2P</S.SelectItem>
                  <S.SelectItem value="Basic">Nameless Glory</S.SelectItem>
                  <S.SelectItem value="Premium">Nameless Medal</S.SelectItem>
                </S.SelectContent>
              </S.Select>
              <F.FormMessage />
            </div>
          </F.FormItem>
        )}
      />
      {usingBP !== "None" && <Separator className="my-4" />}
      {usingBP !== "None" && (
        <F.FormField
          control={form.control}
          name="battlePass.currentLevel"
          render={({ field }) => (
            <F.FormItem className="w-full">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
                <div className="sm:w-3/4 space-y-1">
                  <F.FormLabel>Current Nameless Honor Level</F.FormLabel>
                  <F.FormDescription className="text-justify">
                    This assumes you level up by 10 every Monday.
                    <br />
                    If you select {"Nameless Medal"} then keep in mind you also
                    get 10 levels for free, please update the level accordingly.
                  </F.FormDescription>
                </div>
                <F.FormControl>
                  <Input
                    className="w-20 max-w-fit"
                    type="number"
                    min={0}
                    max={50}
                    onKeyDown={(e) => {
                      if (e.code === "Minus") e.preventDefault();
                    }}
                    {...field}
                  />
                </F.FormControl>
              </div>
              <F.FormMessage />
            </F.FormItem>
          )}
        />
      )}
    </div>
  );
};
export { BattlePassField };
