import { ENDPOINT } from "@/server/endpoints";
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

type Props = {
  data: z.infer<typeof ENDPOINT.jadeEstimate.response> | undefined;
};
const JadeRewardTable = ({ data }: Props) => {
  if (!data) return null;
  return (
    <Table>
      <TableCaption>Breakdown of where you're getting the jades</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Source</TableHead>
          <TableHead>Recurring</TableHead>
          <TableHead className="text-right">Jades</TableHead>
          <TableHead className="text-right">Rolls</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.sources.map((source) => (
          <TableRow key={source.source}>
            <TableCell>{source.source}</TableCell>
            <TableCell>{source.source_type}</TableCell>
            <TableCell>{source.jades_amount}</TableCell>
            <TableCell>{source.rolls_amount}</TableCell>
          </TableRow>
        ))}
        <TableRow>
          <TableCell className="font-bold">Total</TableCell>
          <TableCell></TableCell>
          <TableCell className="font-bold">{data.total_jades}</TableCell>
          <TableCell className="font-bold">{data.rolls}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};
export default JadeRewardTable;
