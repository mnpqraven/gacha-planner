import { JadeEstimateProvider } from "./formProvider";
import JadeEstimateForm from "./JadeEstimateForm";
import JadeRewardTable from "./JadeRewardTable";

export default async function Home() {
  return (
    <main className="mt-4 flex w-screen flex-col items-center gap-4 md:flex-row md:items-start md:justify-evenly">
      <JadeEstimateProvider>
        <div className="w-11/12 md:w-[47%]">
          <JadeEstimateForm />
        </div>
        <div className="w-11/12 md:w-[47%]">
          <JadeRewardTable />
        </div>
      </JadeEstimateProvider>
    </main>
  );
}
