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
  return (
    <Table>
      <TableCaption>Breakdown of where you're getting the jades</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Source</TableHead>
          <TableHead>Recurring</TableHead>
          <TableHead>Jades</TableHead>
          <TableHead>Rolls</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data?.sources.map((source) => (
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
          <TableCell className="font-bold">{data?.total_jades ?? 0}</TableCell>
          <TableCell className="font-bold">{data?.rolls ?? 0}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};
export default JadeRewardTable;
