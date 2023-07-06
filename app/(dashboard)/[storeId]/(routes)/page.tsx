import prismadb from "@/lib/prismadb";
import React from "react";

interface DashboardPageProps {
  params: {
    storeId: string;
  };
}

const DashboardPage: React.FC<DashboardPageProps> = async (props) => {
  const { params } = props;
  const store = await prismadb.store.findFirst({
    where: {
      id: params.storeId,
    },
  });
  return <div>DashboardPage : {store?.name}</div>;
};

export default DashboardPage;
