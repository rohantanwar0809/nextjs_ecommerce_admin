import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

//GET route for size retrieval by ID
export async function GET(
  req: Request,
  { params }: { params: { storeId: string; sizeId: string } }
) {
  try {
    if (!params.sizeId) {
      return new NextResponse("Size ID is Required", { status: 400 });
    }

    const size = await prismadb.size.findUnique({
      where: { id: params.sizeId },
    });

    return NextResponse.json(size);
  } catch (error) {
    console.log("[SIZES/GET] error", error);
  }
}

// update a size with PATCH
export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; sizeId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { name, value } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!name) {
      return new NextResponse("Name is Required", { status: 400 });
    }

    if (!value) {
      return new NextResponse("Value is Required", { status: 400 });
    }

    if (!params.sizeId) {
      return new NextResponse("Size ID is Required", { status: 400 });
    }

    const size = await prismadb.size.update({
      where: { id: params.sizeId },
      data: {
        name,
        value,
      },
    });

    return NextResponse.json(size);
  } catch (error) {
    console.log("[SIZES/PATCH] error", error);
  }
}

//delete a size with DELETE
export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string; sizeId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!params.sizeId) {
      return new NextResponse("Size ID is Required", { status: 400 });
    }

    const size = await prismadb.size.delete({
      where: { id: params.sizeId },
    });

    return NextResponse.json(size);
  } catch (error) {
    console.log("[SIZES/DELETE] error", error);
  }
}
