import { StateProvider } from "../components/StateProvider";
import JadeEstimateForm from "./JadeEstimateForm";
import JadeRewardTable from "./JadeRewardTable";

export default async function Home() {
  return (
    <main className="mt-4 flex w-screen flex-col items-center gap-4 md:flex-row md:items-start md:justify-evenly">
      <StateProvider devTools>
        <div className="w-11/12 md:w-[45%]">
          <JadeEstimateForm />
        </div>
        <div className="w-11/12 md:w-[45%]">
          <JadeRewardTable />
        </div>
      </StateProvider>
    </main>
  );
}
