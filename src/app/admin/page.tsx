import { ChartAreaInteractive } from "@/components/shared/chart-area-interactive";
import { DataTable } from "@/components/shared/data-table";
import { SectionCards } from "@/components/shared/section-cards";

import data from "./data.json";

export default function Page() {
  return (
    <>
      <SectionCards />
      <div className="px-4 lg:px-6">
        <ChartAreaInteractive />
      </div>
      <DataTable data={data} />
    </>
  );
}
