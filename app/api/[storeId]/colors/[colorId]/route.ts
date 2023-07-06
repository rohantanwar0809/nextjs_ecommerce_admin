import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

//GET route for color retrieval by ID
export async function GET(
  req: Request,
  { params }: { params: { storeId: string; colorId: string } }
) {
  try {
    if (!params.colorId) {
      return new NextResponse("Color ID is Required", { status: 400 });
    }

    const color = await prismadb.color.findUnique({
      where: { id: params.colorId },
    });

    return NextResponse.json(color);
  } catch (error) {
    console.log("[COLORS/GET] error", error);
  }
}

// update a color with PATCH
export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; colorId: string } }
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

    if (!params.colorId) {
      return new NextResponse("Color ID is Required", { status: 400 });
    }

    const color = await prismadb.color.update({
      where: { id: params.colorId },
      data: {
        name,
        value,
      },
    });

    return NextResponse.json(color);
  } catch (error) {
    console.log("[COLORS/PATCH] error", error);
  }
}

//delete a color with DELETE
export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string; colorId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!params.colorId) {
      return new NextResponse("Color ID is Required", { status: 400 });
    }

    const color = await prismadb.color.delete({
      where: { id: params.colorId },
    });

    return NextResponse.json(color);
  } catch (error) {
    console.log("[COLORS/DELETE] error", error);
  }
}
