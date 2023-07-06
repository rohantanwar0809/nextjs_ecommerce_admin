import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

//GET route for product retrieval by ID
export async function GET(
  req: Request,
  { params }: { params: { storeId: string; productId: string } }
) {
  try {
    if (!params.productId) {
      return new NextResponse("Product ID is Required", { status: 400 });
    }

    const product = await prismadb.product.findUnique({
      where: { id: params.productId },
      include: {
        category: true,
        size: true,
        color: true,
        images: true,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log("[PRODUCT/GET] error", error);
  }
}

// update a product with PATCH
export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; productId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const {
      name,
      price,
      categoryId,
      sizeId,
      colorId,
      images,
      isFeatured,
      isArchived,
    } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!name) {
      return new NextResponse("Name is Required", { status: 400 });
    }

    if (!price) {
      return new NextResponse("Price is Required", { status: 400 });
    }

    if (!categoryId) {
      return new NextResponse("Category ID is Required", { status: 400 });
    }

    if (!sizeId) {
      return new NextResponse("Size ID is Required", { status: 400 });
    }

    if (!colorId) {
      return new NextResponse("Color ID is Required", { status: 400 });
    }

    if (!images) {
      return new NextResponse("Images are Required", { status: 400 });
    }

    if (!params.productId) {
      return new NextResponse("Product ID is Required", { status: 400 });
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

    await prismadb.product.update({
      where: { id: params.productId },
      data: {
        name,
        price,
        categoryId,
        sizeId,
        colorId,
        images: {
          deleteMany: {},
        },
        isFeatured,
        isArchived,
      },
    });

    const product = await prismadb.product.update({
      where: { id: params.productId },
      data: {
        images: {
          createMany: {
            data: [...images.map((image: { url: string }) => image)],
          },
        },
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log("[PRODUCT/PATCH] error", error);
  }
}

//delete a product with DELETE
export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string; productId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!params.productId) {
      return new NextResponse("Product ID is Required", { status: 400 });
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

    await prismadb.product.delete({
      where: { id: params.productId },
    });

    return new NextResponse("Product Deleted", { status: 200 });
  } catch (error) {
    console.log("[PRODUCT/DELETE] error", error);
  }
}
