import * as z from "zod";

export interface List<T> {
  list: T[];
  [k: string]: unknown;
}

/**
 * Dotted string typeguard for nested object
 */
export type DottedPaths<T> = Join<Extract<DottablePaths<T>, string[]>, ".">;

type Prev = [never, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
type DottablePaths<T, P extends Prev[number] = 10> =
  | []
  | ([P] extends [never]
      ? never
      : T extends readonly any[]
      ? never
      : T extends object
      ? {
          [K in ExtractDottable<keyof T>]: [K, ...DottablePaths<T[K], Prev[P]>];
        }[ExtractDottable<keyof T>]
      : never);

const digit = z.enum(["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]);
type Digit = z.infer<typeof digit>;

const badChars = z.enum([
  "~",
  "`",
  "!",
  "@",
  "#",
  "%",
  "^",
  "&",
  "*",
  "(",
  ")",
  "-",
  "+",
  "=",
  "{",
  "}",
  ";",
  ":",
  "'",
  '"',
  "<",
  ">",
  ",",
  ".",
  "/",
  "?",
]);
type BadChars = z.infer<typeof badChars>;

type ExtractDottable<K extends PropertyKey> = K extends string
  ? string extends K
    ? never
    : K extends `${Digit}${infer _}` | `${infer _}${BadChars}${infer _}`
    ? never
    : K
  : never;

type Join<T extends string[], D extends string> = T extends []
  ? never
  : T extends [infer F]
  ? F
  : T extends [infer F, ...infer R]
  ? F extends string
    ? string extends F
      ? string
      : `${F}${D}${Join<Extract<R, string[]>, D>}`
    : never
  : string;
