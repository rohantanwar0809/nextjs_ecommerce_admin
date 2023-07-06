import prismadb from "@/lib/prismadb";
import { format } from "date-fns";

import { BillboardClient } from "./components/client";
import { BillboardColumn } from "./components/columns";

const BillboardsPage = async ({ params }: { params: { storeId: string } }) => {
  const billBoards = await prismadb.billBoard.findMany({
    where: {
      storeId: params.storeId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedBillBoards: BillboardColumn[] = billBoards.map(
    (billBoard) => ({
      id: billBoard.id,
      label: billBoard.label,
      createdAt: format(billBoard.createdAt, "MMMM do, yyyy"),
    })
  );

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BillboardClient data={formattedBillBoards} />
      </div>
    </div>
  );
};
export default BillboardsPage;
