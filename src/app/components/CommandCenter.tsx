import Image from "next/image";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "./ui/Command";
import { ChangeEvent, useEffect, useState } from "react";
import { Button } from "./ui/Button";
import { UserPlus2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/Dialog";
import { Input } from "./ui/Input";
import { useMutation } from "@tanstack/react-query";
import { workerFetch } from "@/server/fetchHelper";
import ENDPOINT, { IMAGE_URL } from "@/server/endpoints";
import { Skeleton } from "./ui/Skeleton";
import { MihoResponse } from "@/bindings/MihoResponse";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/Card";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useRouter } from "next/navigation";

type Props = {
  routes: { path: string; label: string; icon: JSX.Element }[];
};
const CommandCenter = ({ routes }: Props) => {
  const [open, setOpen] = useState(false);
  const [uidOpen, setUidOpen] = useState(false);
  const [mhyProfile, setMhyProfile] = useLocalStorage<MihoResponse | undefined>(
    "mhyProfile",
    undefined
  );
  const [profile, setProfile] = useState(mhyProfile);
  const router = useRouter();

  useEffect(() => {
    if (mhyProfile) setProfile(mhyProfile);
  }, [mhyProfile]);

  const uidQuery = undefined;

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.altKey || e.metaKey)) {
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  function uidModalOpen() {
    setUidOpen(true);
  }

  function getUidInfo(e: ChangeEvent<HTMLInputElement>) {
    setProfile(undefined);
    // 805768477
    // uidQuery.mutate({ id: e.target.value });
  }
  function commandSelectRoute(path: string) {
    router.push(path);
    setOpen(false);
  }

  return (
    <>
      <Button
        variant={"outline"}
        className="justify-between text-muted-foreground"
        onClick={() => setOpen(true)}
      >
        <span className="mr-4">Command Pallete</span>
        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
          <span className="text-xs">⌘/Alt + K</span>
        </kbd>
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Click on a result or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Configurations">
            <CommandItem onSelect={uidModalOpen}>
              <UserPlus2 className="mr-2 h-4 w-4" />
              <span>Set UID</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Tools">
            {routes.map(({ path, icon, label }) => (
              <CommandItem onSelect={() => commandSelectRoute(path)} key={path}>
                <span className="mr-2">{icon}</span>
                <span>{label}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>

      <Dialog open={uidOpen} onOpenChange={setUidOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Set UID</DialogTitle>
            <DialogDescription>Description</DialogDescription>
          </DialogHeader>
          <Input
            placeholder="Enter UID"
            onChange={getUidInfo}
            defaultValue={mhyProfile?.player.uid}
          />
          {/* {uidQuery.isLoading && <Loader />} */}
          {profile && (
            <Card className="bg-muted rounded-lg">
              <div className="flex items-center p-4 gap-4">
                <Image
                  src={IMAGE_URL + profile.player.avatar.icon}
                  alt={profile.player.avatar.name}
                  width={48}
                  height={48}
                />
                <CardHeader className="p-0">
                  <CardTitle>{profile.player.nickname}</CardTitle>
                  <CardDescription>
                    Trailblazer Level {profile.player.world_level}
                  </CardDescription>
                </CardHeader>
              </div>

              <CardContent>{profile.player.signature}</CardContent>
            </Card>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

const Loader = () => {
  return (
    <div className="flex items-center space-x-4">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  );
};
export { CommandCenter };
