import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

//GET route for billboard retrieval by ID
export async function GET(
  req: Request,
  { params }: { params: { storeId: string; billboardId: string } }
) {
  try {
    if (!params.billboardId) {
      return new NextResponse("Billboard ID is Required", { status: 400 });
    }

    const billBoard = await prismadb.billBoard.findUnique({
      where: { id: params.billboardId },
    });

    return NextResponse.json(billBoard);
  } catch (error) {
    console.log("[BILLBOARD/GET] error", error);
  }
}

// update a billlboard
export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; billboardId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { label, imageUrl } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!label) {
      return new NextResponse("Label is Required", { status: 400 });
    }

    if (!imageUrl) {
      return new NextResponse("Image URL is Required", { status: 400 });
    }

    if (!params.billboardId) {
      return new NextResponse("Billboard ID is Required", { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const updateBillboard = await prismadb.billBoard.update({
      where: { id: params.billboardId },
      data: { label, imageUrl },
    });

    return NextResponse.json(updateBillboard);
  } catch (error) {
    console.log("[BILLBOARD/PATCH] error", error);
  }
}

//delete a billboard
export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string; billboardId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!params.billboardId) {
      return new NextResponse("Billboard ID is Required", { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const billBoard = await prismadb.billBoard.delete({
      where: { id: params.billboardId },
    });

    return NextResponse.json(billBoard);
  } catch (error) {
    console.log("[BILLBOARD/DELETE] error", error);
  }
}
