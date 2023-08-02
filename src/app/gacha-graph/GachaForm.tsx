import { Banner, useBannerList } from "@/hooks/queries/useGachaBannerList";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/Select";
import { Input } from "../components/ui/Input";
import { range } from "@/lib/utils";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/Form";
import { UseFormReturn } from "react-hook-form";
import { useDebounce } from "@/hooks/useDebounce";
import { Switch } from "../components/ui/Switch";
import { PlainMessage } from "@bufbuild/protobuf";
import { BannerType, ProbabilityRatePayload } from "@grpc/probabilityrate_pb";

type FormSchema = PlainMessage<ProbabilityRatePayload>;

type Props = {
  updateQuery: (payload: FormSchema) => void;
  bannerOnChange: (value: "SSR" | "SR" | "LC") => void;
  selectedBanner: Banner;
  form: UseFormReturn<FormSchema>;
};

export function GachaForm({
  updateQuery,
  selectedBanner,
  bannerOnChange,
  form,
}: Props) {
  const { bannerList } = useBannerList();
  const debounceOnChange = useDebounce(form.handleSubmit(updateQuery), 300);

  function preventMinus(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.code === "Minus") e.preventDefault();
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(updateQuery)}
        onInvalid={console.error}
        onChange={debounceOnChange}
      >
        <div className="flex flex-col flex-wrap justify-evenly gap-y-4 rounded-md border p-4 md:flex-row md:space-x-4">
          <FormField
            control={form.control}
            name="banner"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Banner</FormLabel>
                <Select
                  defaultValue={String(BannerType.SSR)}
                  onValueChange={(bannerType) => {
                    const parsed = BannerType[parseInt(bannerType)] as
                      | "SSR"
                      | "SR"
                      | "LC";
                    bannerOnChange(parsed);
                    field.onChange(parseInt(bannerType));
                  }}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent position="popper">
                    {bannerList.map(({ bannerName, bannerType }, index) => (
                      <SelectItem
                        value={String(BannerType[bannerType])}
                        key={index}
                      >
                        {bannerName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="pulls"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Total Available Rolls</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    onKeyDown={preventMinus}
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="pity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pulls since last 5✦</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    max={89}
                    onKeyDown={preventMinus}
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="currentEidolon"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current {selectedBanner.constPrefix}</FormLabel>
                <Select
                  onValueChange={(e) => {
                    field.onChange(parseInt(e));
                  }}
                  value={String(field.value)}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent position="popper">
                    <SelectItem value="-1">Not Owned</SelectItem>
                    {Array.from(
                      range(
                        selectedBanner.minConst + 1,
                        selectedBanner.maxConst - 1,
                        1
                      )
                    ).map((e) => (
                      <SelectItem value={String(e)} key={e}>
                        {selectedBanner.constPrefix}{" "}
                        {selectedBanner.bannerType === "LC" ? e + 1 : e}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="nextGuaranteed"
            render={({ field }) => (
              <FormItem>
                <div className="flex h-full flex-col">
                  <div>
                    <FormLabel htmlFor="isGuaranteed">
                      Next 5✦ Guaranteed
                    </FormLabel>
                  </div>
                  <div className="mt-2 flex h-full flex-col justify-center">
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        id="isGuaranteed"
                      />
                    </FormControl>
                  </div>
                </div>
              </FormItem>
            )}
          />
        </div>
      </form>
    </Form>
  );
}
