import ENDPOINT from "@/server/endpoints";
import * as z from "zod";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/Table";
import { AlertCircle } from "lucide-react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/HoverCard";

type Props = {
  data: z.infer<typeof ENDPOINT.jadeEstimate.response> | undefined;
};
const JadeRewardTable = ({ data }: Props) => {
  // FIX: with of table when there's no data is shorter,
  // leading to sudden component movement
  function getDayInfo() {
    if (!data) return null;
    if (data.days <= 1) return `(${data.days} day)`;
    else return `(${data.days} days)`;
  }

  return (
    <Table>
      <TableCaption>Breakdown of where you're getting the jades</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>
            <div className="inline-flex">
              Source
              <HoverCard openDelay={0}>
                <HoverCardTrigger>
                  <AlertCircle className="scale-75 mx-1 align-text-bottom rounded-md hover:bg-accent hover:text-accent-foreground" />
                </HoverCardTrigger>
                <HoverCardContent>
                  These are repeatable rewards that are guaranteed to you and
                  does not include one-off rewards like events or redemption
                  codes/promotions. You're bound to receive more than the table
                  shows as you play the game
                </HoverCardContent>
              </HoverCard>
            </div>
          </TableHead>
          <TableHead>Recurring</TableHead>
          <TableHead>Jades</TableHead>
          <TableHead>Sp. Rail Pass</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data?.sources.map((source) => (
          <TableRow key={source.source}>
            <TableCell>
              {!source.description ? (
                source.source
              ) : (
                <div className="inline-flex">
                  {source.source}
                  <HoverCard openDelay={0}>
                    <HoverCardTrigger className="inline-flex">
                      <AlertCircle className="scale-75 mx-1 align-text-bottom rounded-md hover:bg-accent hover:text-accent-foreground" />
                    </HoverCardTrigger>
                    <HoverCardContent>{source.description}</HoverCardContent>
                  </HoverCard>
                </div>
              )}
            </TableCell>
            <TableCell>{source.source_type}</TableCell>
            <TableCell>{source.jades_amount}</TableCell>
            <TableCell>{source.rolls_amount}</TableCell>
          </TableRow>
        ))}
        <TableRow>
          <TableCell className="font-bold">Total {getDayInfo()}</TableCell>
          <TableCell></TableCell>
          <TableCell className="font-bold">{data?.total_jades ?? 0}</TableCell>
          <TableCell className="font-bold">{data?.rolls ?? 0}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};
export default JadeRewardTable;
