import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";

export async function GET(req: NextRequest, { params }: { params: Promise<{ code: string }> }) {
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
      customURL: `${process.env.NEXT_PUBLIC_BASE_URL}/${customCode}`,
      clicks: link.clicks,
    },
    { status: 200 }
  );
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ code: string }> }){
  const { code: customCode } = await params;
    
}