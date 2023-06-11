import { Banner, useBannerList } from "@/hooks/queries/useBannerList";
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
import * as z from "zod";
import ENDPOINT from "@/server/endpoints";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDebounce } from "@/hooks/useDebounce";
import { Switch } from "../components/ui/Switch";
import { defaultGachaQuery } from "./types";

type FormSchema = z.infer<typeof ENDPOINT.probabilityRate.payload>;

type Props = {
  updateQuery: (payload: FormSchema) => void;
  bannerOnChange: (value: FormSchema["banner"]) => void;
  updateEidolon: (value: number) => void;
  selectedBanner: Banner;
};

export function GachaForm({
  updateQuery,
  selectedBanner,
  bannerOnChange,
  updateEidolon,
}: Props) {
  const { bannerList } = useBannerList();
  const form = useForm<FormSchema>({
    resolver: zodResolver(ENDPOINT.probabilityRate.payload),
    defaultValues: defaultGachaQuery,
  });
  const debounceOnChange = useDebounce(form.handleSubmit(updateQuery), 300);

  function preventMinus(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.code === "Minus") e.preventDefault();
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(updateQuery)}
        onInvalid={(e) => console.log(e)}
        // className="space-y-4"
        onChange={debounceOnChange}
      >
        <div className="flex flex-col md:flex-row flex-wrap md:space-x-4 gap-y-4 rounded-md border p-4 justify-evenly">
          <FormField
            control={form.control}
            name="banner"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Banner</FormLabel>
                <Select
                  defaultValue={field.value}
                  onValueChange={(
                    bannerType: (typeof bannerList)[number]["bannerType"]
                  ) => {
                    bannerOnChange(bannerType);
                    field.onChange(bannerType);
                  }}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent position="popper">
                    {bannerList.map(({ bannerName, bannerType }, index) => (
                      <SelectItem value={bannerType} key={index}>
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
                <FormLabel>Pulls since last SSR</FormLabel>
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
                    updateEidolon(parseInt(e));
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
                        {selectedBanner.constPrefix} {e}
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
                <div className="flex flex-col h-full">
                  <div>
                    <FormLabel>Next SSR Guaranteed</FormLabel>
                  </div>
                  <div className="flex flex-col justify-center h-full">
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