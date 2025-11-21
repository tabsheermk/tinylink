import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../lib/prisma";

export async function POST(req: NextRequest) {
    try {
        const { url, customCode } = await req.json();

        if (!url || typeof url !== 'string' || url.trim() === '') {
            return NextResponse.json({message: "Valid 'url' is required"}, {status: 400});
        }

        if (!customCode || typeof customCode !== 'string' || customCode.trim() === '') {
            return NextResponse.json({message: "customCode is required"}, {status: 400});
        }

        const existingURL = await prisma.link.findUnique({where: {code: customCode}});

        if (existingURL) {
            return  NextResponse.json(
                {message: 'Custom URL already exists for the code'},
                {status: 409}
            )
        }

        const newLink = await prisma.link.create({
            data: {
                code: customCode, 
                url,
            },
        });

        return NextResponse.json(
            {shortUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/${customCode}`},
            {status: 201}
        );

    } catch(error) {
        return NextResponse.json(
        { message: "Internal Server Error" }, 
        { status: 500 } );
    }
}


export async function GET() {
    const links = await prisma.link.findMany();

    return NextResponse.json(
        {links},
        {status: 200}
    )
}