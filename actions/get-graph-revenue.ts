import prismadb from "@/lib/prismadb";

interface GraphData {
  name: string;
  total: number;
}

export const getGraphRevenue = async (storeId: string) => {
  const paidOrders = await prismadb.order.findMany({
    where: {
      isPaid: true,
      storeId,
    },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
  });

  const monthlyRevenue: { [key: number]: number } = {};

  for (const order of paidOrders) {
    const month = order.createdAt.getMonth();
    let revenueForOrder = 0;

    for (const orderItem of order.orderItems) {
      revenueForOrder += orderItem.product.price.toNumber();
    }

    monthlyRevenue[month] = (monthlyRevenue[month] || 0) + revenueForOrder;
  }

  const graphData: GraphData[] = [
    {
      name: "January",
      total: 0,
    },
    {
      name: "February",
      total: 0,
    },
    {
      name: "March",
      total: 0,
    },
    {
      name: "April",
      total: 0,
    },
    {
      name: "May",
      total: 0,
    },
    {
      name: "June",
      total: 0,
    },
    {
      name: "July",
      total: 0,
    },
    {
      name: "August",
      total: 0,
    },
    {
      name: "September",
      total: 0,
    },
    {
      name: "October",
      total: 0,
    },
    {
      name: "November",
      total: 0,
    },
    {
      name: "December",
      total: 0,
    },
  ];

  for (const key in monthlyRevenue) {
    const month = parseInt(key);
    graphData[month].total = monthlyRevenue[month];
  }

  return graphData;
};
