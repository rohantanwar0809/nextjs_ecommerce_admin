"use client";

import { useRouter, useParams } from "next/navigation";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/data-table";
import { ApiList } from "@/components/ui/api-list";

import { OrderColumn, columns } from "./columns";

interface OrderClientProps {
  data: OrderColumn[];
}

export const OrderClient: React.FC<OrderClientProps> = ({ data }) => {
  return (
    <>
      <Heading
        title={`Orders (${data?.length})`}
        description="Manage Orders for your store."
      />
      <Separator />
      <DataTable columns={columns} data={data} searchKey="products" />
    </>
  );
};
