"use client";

import { useForm } from "react-hook-form";
import { Input } from "../components/ui/Input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/Form";
import { LANG, LANGS } from "@/lib/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "../components/ui/Button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/Select";
import { Loader2, Pin, PinOff } from "lucide-react";
import { useMihomoInfo } from "./[uid]/useMihomoInfo";
import { useEffect, useMemo, useState } from "react";
import { PlayerCard } from "./PlayerCard";
import { useRouter } from "next/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "../components/ui/Tooltip";
import { MihomoPlayer } from "./types";
import { Toggle } from "../components/ui/Toggle";
import Link from "next/link";
import { PrimitiveAtom, atom, useAtom, useAtomValue, useSetAtom } from "jotai";
import { cachedProfileAtoms, cachedProfilesAtom } from "./_store/main";

const schema = z.object({
  uid: z
    .string()
    .min(1, { message: "Player UID must contain at least 1 character" })
    .refine(
      (val) =>
        z.string().regex(/^\d+$/).transform(Number).safeParse(val).success,
      { message: "Invalid number" }
    ),
  lang: z.enum(LANGS),
});
type FormSchema = z.infer<typeof schema>;

const defaultValues: FormSchema = { uid: "", lang: "en" };

export default function Profile() {
  const form = useForm<FormSchema>({
    defaultValues,
    resolver: zodResolver(schema),
  });
  const [prof, setProf] = useState(defaultValues);
  const { query, prefetch } = useMihomoInfo(prof);
  const router = useRouter();

  const playerProfileAtoms = useAtomValue(cachedProfileAtoms);
  const queryProfileAtom = useMemo(
    () => atom(query.data?.player),
    [query.data]
  );
  const queryProfile = useAtomValue(queryProfileAtom);

  function onSubmit(values: FormSchema) {
    setProf(values);
  }

  useEffect(() => {
    if (!!query.data) {
      const la = prof.lang == "en" ? "" : `?lang=${prof.lang}`;
      const url = `/card/${prof.uid}${la}`;
      router.prefetch(url);
      prefetch(prof.uid, prof.lang);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.data]);

  return (
    <main className="flex flex-col items-center">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mt-12 flex h-32 flex-col items-center justify-center gap-4 md:flex-row md:items-start"
        >
          <FormField
            name="uid"
            render={({ field }) => (
              <FormItem>
                <FormLabel>UID</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your UID..."
                    className="w-56"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="w-56 whitespace-pre-wrap" />
              </FormItem>
            )}
          />

          <FormField
            name="lang"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Language</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.entries(LANG).map(([lang, label]) => (
                      <SelectItem key={lang} value={lang}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="mt-4 w-fit items-center md:mt-[34px] md:self-start"
            size="sm"
          >
            Search
          </Button>

          <Link href="/card/custom">
            <Button
              variant="outline"
              className="mt-4 w-fit items-center md:mt-[34px] md:self-start"
              size="sm"
            >
              Custom card
            </Button>
          </Link>
        </form>
      </Form>

      {query.isLoading && <Loader2 className="mr-1 animate-spin" />}
      {!!queryProfile && (
        <div className="flex items-center gap-3">
          <PinProfileButton atom={queryProfileAtom} />

          <PlayerCard atom={queryProfileAtom} lang={form.watch("lang")} />
        </div>
      )}
      {playerProfileAtoms.length > 0 && (
        <>
          <h1 className="my-4">Saved Profile</h1>
          <div className="flex flex-col gap-4">
            {playerProfileAtoms.map((profileAtom, index) => (
              <div className="flex items-center gap-3" key={index}>
                <UnpinButton atom={profileAtom} />

                <PlayerCard atom={profileAtom} />
              </div>
            ))}
          </div>
        </>
      )}
    </main>
  );
}

interface PinProps {
  atom: PrimitiveAtom<MihomoPlayer | undefined>;
}
function PinProfileButton({ atom }: PinProps) {
  const [playerProfiles, setPlayerProfiles] = useAtom(cachedProfilesAtom);
  // safe define
  const current = useAtomValue(atom);
  const find = playerProfiles.find((e) => e.uid == current?.uid);
  const pressed = !!find;

  function updatePin() {
    if (!!find) {
      // delete
      setPlayerProfiles(playerProfiles.filter((e) => e.uid !== current?.uid));
    } else if (!!current) {
      // append
      setPlayerProfiles([...playerProfiles, current]);
    }
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Toggle onPressedChange={updatePin}>
          {pressed ? (
            <PinOff className={"h-4 w-4"} />
          ) : (
            <Pin className={"h-4 w-4"} />
          )}
        </Toggle>
      </TooltipTrigger>
      <TooltipContent>{pressed ? "Unsave" : "Save"}</TooltipContent>
    </Tooltip>
  );
}

interface UnpinProps {
  atom: PrimitiveAtom<MihomoPlayer>;
}
function UnpinButton({ atom }: UnpinProps) {
  const setPlayerProfileAtoms = useSetAtom(cachedProfileAtoms);
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Toggle
          onPressedChange={() => {
            setPlayerProfileAtoms({
              type: "remove",
              atom,
            });
          }}
        >
          <PinOff className={"h-4 w-4"} />
        </Toggle>
      </TooltipTrigger>
      <TooltipContent>Unsave</TooltipContent>
    </Tooltip>
  );
}
