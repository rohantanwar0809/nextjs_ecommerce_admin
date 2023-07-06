import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

// update a store
export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { name } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!name) {
      return new NextResponse("Name is Required", { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse("Store ID is Required", { status: 400 });
    }

    const updatedStore = await prismadb.store.update({
      where: { id: params.storeId },
      data: { name },
    });

    return NextResponse.json(updatedStore);
  } catch (error) {
    console.log("[STORES/PATCH] error", error);
  }
}

// delete a store
export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.storeId) {
      return new NextResponse("Store ID is Required", { status: 400 });
    }

    await prismadb.store.delete({ where: { id: params.storeId } });

    return new NextResponse("Store Deleted", { status: 200 });
  } catch (error) {
    console.log("[STORES/DELETE] error", error);
  }
}
