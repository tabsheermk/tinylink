import { notFound } from "next/navigation";

interface Link {
  code: string;
  url: string;
  clicks: number;
  lastClickedAt: string | null;
  createdAt: string;
}

export default async function LinkDetailsPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params; // await params here

  if (!code) {
    notFound();
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/links/${code}`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    notFound();
  }

  const data = await res.json();
  const link: Link = data.link;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Stats for {link.code}</h1>
      <p>
        <strong>Target URL:</strong>{" "}
        <a
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline"
        >
          {link.url}
        </a>
      </p>
      <p>
        <strong>Total Clicks:</strong> {link.clicks}
      </p>
      <p>
        <strong>Created At:</strong> {new Date(link.createdAt).toLocaleString()}
      </p>
      <p>
        <strong>Last Clicked At:</strong>{" "}
        {link.lastClickedAt
          ? new Date(link.lastClickedAt).toLocaleString()
          : "Never"}
      </p>
    </div>
  );
}
