import { Card, CardHeader, CardTitle } from "@/app/components/ui/Card";
import styles from "@/css/floating-card.module.css";
import { cn } from "@/lib/utils";

export default function Loading() {
  return (
    <>
      <div className="w-full p-12 md:max-w-[50%]">
        <div className={cn("relative h-fit w-full", styles["card"])}>
          <div className="aspect-[902/1260] h-full w-full place-self-start object-contain"></div>
        </div>
        <div className={styles["glow"]} />
      </div>

      <Card className="w-full md:max-w-[50%]">
        <CardHeader>
          <CardTitle>Skill</CardTitle>
        </CardHeader>
      </Card>
    </>
  );
}
