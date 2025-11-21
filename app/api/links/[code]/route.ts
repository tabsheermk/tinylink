import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code: customCode } = await params;

  const link = await prisma.link.findUnique({
    where: { code: customCode },
  });

  if (!link) {
    return NextResponse.json(
      { message: "No CustomURL exists for the given code" },
      { status: 404 }
    );
  }

  return NextResponse.json(
    {
      link,
      customURL: `${process.env.NEXT_PUBLIC_BASE_URL}/${customCode}`,
    },
    { status: 200 }
  );
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code: customCode } = await params;

    const link = await prisma.link.findUnique({
      where: { code: customCode },
    });

    if (!link) {
      return NextResponse.json(
        { message: "No CustomURL exists for the given code" },
        { status: 404 }
      );
    }

    const updatedLink = await prisma.link.update({
      where: { code: customCode },
      data: {
        clicks: {
          increment: 1,
        },
        lastClickedAt: new Date(),
      },
    });

    return NextResponse.json(
      {
        updatedLink,
        message: "Link count updated successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: `Internal Server Error: ${(error as Error).message}` },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code: customCode } = await params;

    const link = await prisma.link.findUnique({
      where: { code: customCode },
    });

    if (!link) {
      return NextResponse.json(
        { message: "No CustomURL exists for the given code" },
        { status: 404 }
      );
    }

    const deleteLink = await prisma.link.delete({
      where: { code: customCode },
    });

    return NextResponse.json(
      {
        deletedLink: deleteLink,
        message: "Link deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: `Internal Server Error: ${(error as Error).message}` },
      { status: 500 }
    );
  }
}
