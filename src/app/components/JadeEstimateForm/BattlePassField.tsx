import { UseFormReturn } from "react-hook-form";
import * as F from "../ui/Form";
import * as S from "../ui/Select";
import { Separator } from "../ui/Separator";
import { Input } from "../ui/Input";
import { BattlePassType, JadeEstimateCfg } from "@grpc/jadeestimate_pb";

type Props = {
  form: UseFormReturn<JadeEstimateCfg>;
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
            <div className="flex flex-col items-center justify-between gap-2 sm:flex-row">
              <div className="space-y-1 sm:w-3/4">
                <F.FormLabel>Nameless Honor</F.FormLabel>
                <F.FormDescription className="text-justify">
                  If not selecting F2P, this assumes you{"'"}ve received the
                  current patch{"'"}s first time purchase rewards and those won
                  {"'"}t be calculated.
                </F.FormDescription>
              </div>
              <S.Select
                value={String(form.watch("battlePass.battlePassType"))}
                onValueChange={(data) => {
                  const asInt = parseInt(data);
                  field.onChange(asInt);
                }}
                defaultValue={String(BattlePassType.None)}
              >
                <F.FormControl>
                  <S.SelectTrigger className="max-w-fit">
                    <S.SelectValue />
                  </S.SelectTrigger>
                </F.FormControl>
                <S.SelectContent>
                  <S.SelectItem value={String(BattlePassType.None)}>
                    F2P
                  </S.SelectItem>
                  <S.SelectItem value={String(BattlePassType.Basic)}>
                    Nameless Glory
                  </S.SelectItem>
                  <S.SelectItem value={String(BattlePassType.Premium)}>
                    Nameless Medal
                  </S.SelectItem>
                </S.SelectContent>
              </S.Select>
              <F.FormMessage />
            </div>
          </F.FormItem>
        )}
      />
      {usingBP !== BattlePassType.None && <Separator className="my-4" />}
      {usingBP !== BattlePassType.None && (
        <F.FormField
          control={form.control}
          name="battlePass.currentLevel"
          render={({ field }) => (
            <F.FormItem className="w-full">
              <div className="flex flex-col items-center justify-between gap-2 sm:flex-row">
                <div className="space-y-1 sm:w-3/4">
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
      )}
    </div>
  );
};
export { BattlePassField };
