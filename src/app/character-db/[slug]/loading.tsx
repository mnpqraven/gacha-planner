import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="grid h-full w-full grid-cols-1 grid-rows-3">
      <div className="flex items-center justify-center">
        <Loader2 className="mr-1 animate-spin" />
        Loading...
      </div>
    </div>
  );
}
