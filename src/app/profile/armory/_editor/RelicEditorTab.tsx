import { UseFormReturn } from "react-hook-form";
import { ArmoryFormSchema, RelicCategory, relicCategories } from "../schema";
import { useRelicSets } from "@/hooks/queries/useRelicSetList";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/Select";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/app/components/ui/Form";
import Image from "next/image";
import { IMAGE_URL } from "@/lib/constants";
import {
  propertyIconUrl,
  propertyIsPercent,
  propertyName,
  relicMainstatOptions,
  subStatOptions,
} from "./relicConfig";
import SVG from "react-inlinesvg";
import { asPercentage, range } from "@/lib/utils";
import { HTMLAttributes, ReactNode, forwardRef, useState } from "react";
import { Property } from "@/bindings/RelicSetSkillConfig";
import { Input } from "@/app/components/ui/Input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/components/ui/Popover";
import { useSubStatSpread } from "@/hooks/queries/useSubStatSpread";
import { RelicSubAffixConfig } from "@/bindings/RelicSubAffixConfig";
import { Button } from "@/app/components/ui/Button";
import {
  ChevronDown,
  ChevronUp,
  ChevronsDownUp,
  CircleDashed,
  Minus,
  Pencil,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/app/components/ui/Tooltip";
import { cva } from "class-variance-authority";

interface Props {
  form: UseFormReturn<ArmoryFormSchema>;
}
export function RelicEditorTab({ form }: Props) {
  const { data: relicSets } = useRelicSets();

  return (
    <div className="grid grid-cols-2 gap-2">
      {relicCategories.map((category, index) => (
        <div key={category} className="flex flex-col rounded-md border p-2">
          <FormField
            control={form.control}
            name={`relic.${category}.setId`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{category}</FormLabel>
                <Select
                  defaultValue={field.value}
                  onValueChange={field.onChange}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {relicSets
                      ?.filter((e) =>
                        index <= 3
                          ? e.set_skill_list.some((num) => num == 4)
                          : e.set_skill_list.every((num) => num <= 2)
                      )
                      .map((set) => (
                        <SelectItem key={set.set_id} value={String(set.set_id)}>
                          <div className="flex items-center gap-2">
                            <Image
                              src={`${IMAGE_URL}icon/relic/${set.set_id}.png`}
                              alt=""
                              height={32}
                              width={32}
                            />

                            {set.set_name}
                          </div>
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          {!!form.watch(`relic.${category}.setId`) && (
            <SingularRelicEditor
              imageUrl={`${IMAGE_URL}icon/relic/${form.watch(
                `relic.${category}.setId`
              )}_${index % 4}.png`}
              category={category}
            />
          )}
        </div>
      ))}
    </div>
  );
}

interface ItemEditorProps {
  category: RelicCategory;
  imageUrl: string;
}
function SingularRelicEditor({ category, imageUrl }: ItemEditorProps) {
  const mainStatOptions = relicMainstatOptions.find((e) => e.type == category);
  const [selectedMainstat, setSelectedMainstat] = useState<
    Property | undefined
  >(
    mainStatOptions?.options.length == 1
      ? mainStatOptions.options[0]
      : undefined
  );
  const [selectedSubstats, setSelectedSubstats] = useState<Property[]>([]);
  const { data } = useSubStatSpread();
  console.log("dev", data);

  if (!mainStatOptions) return null;
  const fixedMainstat = mainStatOptions.options.length == 1;

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex gap-2">
        <div className="flex w-48 items-center justify-center">
          <Image
            src={imageUrl}
            alt=""
            height={128}
            width={128}
            className="h-32 w-32"
          />
        </div>

        <div className="flex flex-col">
          {fixedMainstat ? (
            <span>{propertyName(mainStatOptions.options[0])}</span>
          ) : (
            <Select
              onValueChange={(prop) => setSelectedMainstat(prop as Property)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {mainStatOptions.options.map((option) => (
                  <SelectItem key={option} value={option}>
                    <div className="flex items-center gap-2">
                      <SVG
                        src={propertyIconUrl(option)}
                        width={24}
                        height={24}
                      />

                      <span>{propertyName(option)}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          <Input placeholder="+" />
        </div>
      </div>

      {Array.from(range(0, 3)).map((line) => (
        <div className="flex items-center justify-between" key={line}>
          <Select
            onValueChange={(prop) =>
              setSelectedSubstats((prev) => {
                const next = [...prev];
                next[line] = prop as Property;
                console.log(next);
                return next;
              })
            }
          >
            <SelectTrigger className="max-w-[12rem]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {subStatOptions
                .filter((e) => e.option != selectedMainstat)
                .map(({ option }) => (
                  <SelectItem
                    key={option}
                    value={option}
                    disabled={selectedSubstats.includes(option)}
                  >
                    <div className="flex items-center gap-2">
                      <SVG
                        src={propertyIconUrl(option)}
                        width={24}
                        height={24}
                      />
                      <span>{propertyName(option)}</span>
                    </div>
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>

          <Popover>
            <PopoverTrigger disabled={!selectedSubstats.at(line)}>
              <Button
                className="h-fit cursor-pointer"
                size="sm"
                variant="outline"
                disabled={!selectedSubstats.at(line)}
              >
                Set Substat
              </Button>
            </PopoverTrigger>
            <PopoverContent side="top">
              {!!data?.find((e) => e.property == selectedSubstats[line]) && (
                <SubstatSpreadConfig
                  property={selectedSubstats[line]}
                  spread={
                    data.find((e) => e.property == selectedSubstats[line])!
                  }
                />
              )}
            </PopoverContent>
          </Popover>

          <>{"substat bars here"}</>
        </div>
      ))}
    </div>
  );
}

interface SpreadConfigProps {
  property: Property;
  spread: RelicSubAffixConfig;
}
function SubstatSpreadConfig({ property, spread }: SpreadConfigProps) {
  // 6 items for rolls
  // each roll:
  // abitrary number (need to update roll bars)
  // + whole removal
  // + add min/mid/max roll
  // + bar

  const initialValue = getSpreadValues(spread).midRoll.display;

  return (
    <div>
      <p>{propertyName(property)}</p>
      Rolls: {getSpreadValues(spread).minRoll.display} /{" "}
      {getSpreadValues(spread).midRoll.display} /{" "}
      {getSpreadValues(spread).maxRoll.display}
      <div className="flex items-center">
        <Input className="w-24" type="number" defaultValue={initialValue} />
        {propertyIsPercent(property) && <span>%</span>}
      </div>
      <Popover>
        <PopoverTrigger>
          <Pencil />
        </PopoverTrigger>
        <PopoverContent>input</PopoverContent>
      </Popover>
      <div id="bars" className="flex gap-1">
        {Array.from(range(0, 5)).map((index) => (
          <SubstatItemEditor
            key={index}
            className="flex flex-col items-center gap-1"
            spread={spread}
          />
        ))}
      </div>
    </div>
  );
}

interface SubstatItemEditorProps extends HTMLAttributes<HTMLDivElement> {
  spread: RelicSubAffixConfig;
}

const SubstatItemEditor = forwardRef<HTMLDivElement, SubstatItemEditorProps>(
  ({ spread, ...props }, ref) => {
    const { base_value, step_num, step_value } = spread;
    // const defaultValue = base_value + step_value * (step_num / 2);
    const [defaultValue, setDefaultValue] = useState(0);
    const interacted = false;

    const variant = cva("h-1.5 w-8 border-skewed", {
      variants: {
        status: {
          LOW: "bg-[#4f79b2]",
          MID: "bg-[#c199fd]",
          HIGH: "bg-[#ffc870] ",
          default: "bg-gray-600",
        },
      },
      defaultVariants: { status: "default" },
    });

    return (
      <div {...props} ref={ref}>
        <div
          className={variant({
            status:
              defaultValue <= 0
                ? "default"
                : judgeRollValue(defaultValue, spread),
          })}
        />

        <SubstatControlIcon label="High roll" icon={<ChevronUp />} />
        <SubstatControlIcon label="Normal roll" icon={<Minus />} />
        <SubstatControlIcon label="Low roll" icon={<ChevronDown />} />
      </div>
    );
  }
);
SubstatItemEditor.displayName = "SubstatItemEditor";

interface ControlIconProps extends HTMLAttributes<HTMLButtonElement> {
  label: string;
  icon: ReactNode;
}
const SubstatControlIcon = forwardRef<HTMLButtonElement, ControlIconProps>(
  ({ label, icon, ...props }, ref) => {
    return (
      <Tooltip disableHoverableContent>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            className="h-6 w-6 p-0"
            {...props}
            ref={ref}
          >
            {icon}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left">{label}</TooltipContent>
      </Tooltip>
    );
  }
);
SubstatControlIcon.displayName = "SubstatControlIcon";

function getSpreadValues({
  step_value,
  step_num,
  base_value,
  property,
}: RelicSubAffixConfig) {
  const isPercent = propertyIsPercent(property);

  const minRoll = base_value;
  const midRoll = base_value + (step_value * step_num) / 2;
  const maxRoll = base_value + step_value * step_num;

  return {
    minRoll: {
      value: minRoll,
      display: isPercent ? asPercentage(minRoll) : minRoll.toFixed(2),
    },
    midRoll: {
      value: midRoll,
      display: isPercent ? asPercentage(midRoll) : midRoll.toFixed(2),
    },
    maxRoll: {
      value: maxRoll,
      display: isPercent ? asPercentage(maxRoll) : maxRoll.toFixed(2),
    },
  };
}

function judgeRollValue(
  value: number,
  spreadInfo: RelicSubAffixConfig
): "LOW" | "MID" | "HIGH" {
  const lowerBound = spreadInfo.base_value;
  const upperBound =
    spreadInfo.base_value + spreadInfo.step_num * spreadInfo.step_value;

  const diffPool = upperBound - lowerBound;
  // this is supposed to never happen
  if (upperBound <= lowerBound) {
    return "MID";
  }
  const valueDiff = value - lowerBound;
  const ratio = valueDiff / diffPool;
  if (ratio < 0.33) return "LOW";
  if (ratio >= 0.33 && ratio < 0.66) return "MID";
  return "HIGH";
}
