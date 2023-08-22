import { BASE_1_0 } from "@/lib/constants";

const THREE_WEEKS = 86400000 * 21;
const SIX_WEEKS = 86400000 * 42;

export interface PatchDate {
  startDate: Date;
  midDate: Date;
  endDate: Date;
  version: { major: number; minor: number };
}
export function usePatchDateHelper() {
  function base(): PatchDate {
    const res = {
      startDate: BASE_1_0,
      midDate: new Date(BASE_1_0.getTime() + THREE_WEEKS),
      endDate: new Date(BASE_1_0.getTime() + SIX_WEEKS),
      version: {
        major: 1,
        minor: 0,
      },
    };

    // this structuredClone is important
    return structuredClone(res);
  }

  function setNextPatch(patch: PatchDate) {
    patch.startDate.setDate(patch.startDate.getDate() + 42);
    patch.midDate = new Date(patch.midDate.getTime() + SIX_WEEKS);
    patch.endDate = new Date(patch.endDate.getTime() + SIX_WEEKS);
    patch.version = {
      major: patch.version.major,
      minor: patch.version.minor + 1,
    };
    return patch;
  }

  function currentPatch(abitraryDate?: Date): PatchDate {
    // init
    let patch = base();

    // incremental checks
    const d = abitraryDate ?? new Date();

    while (patch.endDate <= d) {
      setNextPatch(patch);
    }

    return patch;
  }

  function getPhase(abitraryDate?: Date): {
    phase: 1 | 2 | undefined;
    patch: PatchDate;
  } {
    const patch = currentPatch(abitraryDate);
    // console.log(patch);
    const d = abitraryDate ?? new Date();

    const start = patch.startDate.getTime();
    const mid = patch.midDate.getTime();
    const end = patch.endDate.getTime();
    const dTime = d.getTime();

    if (start <= dTime && dTime < mid) return { phase: 1, patch };
    else if (mid <= dTime && dTime < end) return { phase: 2, patch };
    else if (dTime == end)
      // starts of next patch, so phase 1
      return { phase: 1, patch: setNextPatch(patch) };

    return { phase: undefined, patch };
  }

  function getVersion(
    abitraryDate?: Date
  ): `${number}.${number}.${1 | 2}` | undefined {
    const { phase, patch } = getPhase(abitraryDate);
    if (!phase) return undefined;
    else return `${patch.version.major}.${patch.version.minor}.${phase}`;
  }
  return { currentPatch, getPhase, getVersion };
}
