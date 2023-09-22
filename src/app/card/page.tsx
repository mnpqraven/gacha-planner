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
import { useEffect, useState } from "react";
import { PlayerCard } from "./PlayerCard";
import { useRouter } from "next/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "../components/ui/Tooltip";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { MihomoPlayer } from "./types";
import STORAGE from "@/server/storage";
import { Toggle } from "../components/ui/Toggle";
import { cn } from "@/lib/utils";
import { Separator } from "../components/ui/Separator";
import Link from "next/link";

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
  const [playerProfiles, setPlayerProfiles] = useLocalStorage<MihomoPlayer[]>(
    STORAGE.playerProfiles,
    []
  );

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

          <Button
            variant="outline"
            className="mt-4 w-fit items-center md:mt-[34px] md:self-start"
            size="sm"
            disabled
          >
            <Link href="/card/custom">Custom card (Soon!)</Link>
          </Button>
        </form>
      </Form>

      {query.isLoading && <Loader2 className="mr-1 animate-spin" />}
      {query.data && (
        <div className="flex items-center gap-3">
          <PinProfileButton
            profile={query.data.player}
            storage={playerProfiles ?? []}
            onStorageUpdate={setPlayerProfiles}
          />

          <PlayerCard
            player={query.data.player}
            uid={prof.uid}
            lang={form.watch("lang")}
          />
        </div>
      )}
      {playerProfiles && playerProfiles.length > 0 && (
        <>
          <h1 className="my-4">Saved Profile</h1>
          <div className="flex flex-col gap-4">
            {playerProfiles.map((profile) => (
              <div className="flex items-center gap-3" key={profile.uid}>
                <PinProfileButton
                  profile={profile}
                  storage={playerProfiles ?? []}
                  onStorageUpdate={setPlayerProfiles}
                />

                <PlayerCard player={profile} uid={profile.uid} lang="en" />
              </div>
            ))}
          </div>
        </>
      )}
    </main>
  );
}

function PinProfileButton({
  profile,
  storage: playerProfiles,
  onStorageUpdate,
}: {
  profile: MihomoPlayer;
  storage: MihomoPlayer[];
  onStorageUpdate: (storage: MihomoPlayer[]) => void;
}) {
  const isSaved = (data: MihomoPlayer, storage: MihomoPlayer[] | undefined) =>
    !!storage?.find((e) => e.uid === data.uid);

  function upsertLocalSave(saveState: boolean, data: MihomoPlayer) {
    let next = !!playerProfiles ? [...playerProfiles] : [];
    const findIndex = next.findIndex((e) => e.uid == data.uid);
    if (saveState) {
      // upsert logic
      if (findIndex === -1) {
        // push
        next = [...next, data];
      } else {
        // update
        next = next.map((profile, index) =>
          index === findIndex ? data : profile
        );
      }
    } else {
      const n = !!playerProfiles ? [...playerProfiles] : [];
      const index = n.findIndex((e) => e.uid === data.uid);
      n.splice(index, 1);
      next = n;
    }

    onStorageUpdate(next);
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Toggle onPressedChange={(state) => upsertLocalSave(state, profile)}>
          <Pin
            className={cn(
              "h-4 w-4",
              isSaved(profile, playerProfiles) ? "hidden" : ""
            )}
          />
          <PinOff
            className={cn(
              "h-4 w-4",
              isSaved(profile, playerProfiles) ? "" : "hidden"
            )}
          />
        </Toggle>
      </TooltipTrigger>
      <TooltipContent>
        {isSaved(profile, playerProfiles) ? "Unsave" : "Save"} Profile
      </TooltipContent>
    </Tooltip>
  );
}
