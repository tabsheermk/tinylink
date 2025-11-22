import { notFound } from "next/navigation";
import { redirect } from "next/navigation";

interface Link {
  code: string;
  url: string;
  clicks: number;
  lastClickedAt: string | null;
  createdAt: string;
}

export default async function RedirectPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;

  if (!code) notFound();

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/links/${code}`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    notFound();
  }

  await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/links/${code}`, {
    method: "PUT",
  });

  const data = await res.json();
  const link: Link = data.link;

  redirect(link.url);
}
