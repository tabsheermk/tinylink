"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Link {
  code: string;
  url: string;
  clicks: number;
  lastClickedAt: string | null;
  createdAt: string;
}

export default function Dashboard() {
  const [links, setLinks] = useState<Link[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("");
  const [url, setUrl] = useState("");
  const [customCode, setCustomCode] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchLinks() {
      try {
        const res = await fetch("/api/links");
        const data = await res.json();
        setLinks(data.links);
      } catch {
        setLinks([]);
      }
    }
    fetchLinks();
  }, []);

  // Debounce searchTerm -> filter
  useEffect(() => {
    const debounce = setTimeout(() => {
      setFilter(searchTerm);
    }, 300);

    return () => {
      clearTimeout(debounce);
    };
  }, [searchTerm]);

  // Apply filter to links list
  const filteredLinks = links.filter((link) => {
    const code = link.code?.toLowerCase() || "";
    const url = link.url?.toLowerCase() || "";
    const term = filter.toLowerCase();
    return code.includes(term) || url.includes(term);
  });

  // Add new link handler
  async function handleAddLink(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/links", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url, customCode: customCode || undefined }),
    });

    const data = await res.json();

    if (res.ok) {
      const updatedRes = await fetch("/api/links");
      const updatedData = await updatedRes.json();
      setLinks(updatedData.links);
      setUrl("");
      setCustomCode("");
    } else {
      setError(data.error || "Failed to add link");
    }
  }

  // Delete link handler
  async function handleDelete(code: string) {
    if (!confirm(`Are you sure you want to delete short code "${code}"?`))
      return;

    const res = await fetch(`/api/links/${code}`, {
      method: "DELETE",
    });

    if (res.ok) {
      setLinks((prev) => prev.filter((link) => link.code !== code));
    } else {
      alert("Failed to delete link");
    }
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">TinyLink - Shorten your Links</h1>

      {/* Add Link Form */}
      <section className="mb-8 p-4 border rounded shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Add New Link</h2>
        <form
          onSubmit={handleAddLink}
          className="flex flex-col sm:flex-row gap-4"
        >
          <input
            type="url"
            required
            placeholder="Enter target URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-grow p-2 border rounded"
          />
          <input
            type="text"
            required
            placeholder="Custom code (6-8 chars, optional)"
            value={customCode}
            maxLength={8}
            pattern="[A-Za-z0-9]{6,8}"
            onChange={(e) => setCustomCode(e.target.value)}
            className="w-48 p-2 border rounded"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700"
          >
            Add
          </button>
        </form>
        {error && <p className="mt-2 text-red-600">{error}</p>}
      </section>

      {/* Search Bar */}
      <section className="mb-4">
        <input
          type="search"
          placeholder="Search by code or URL"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </section>

      {/* Links Table */}
      <section className="max-h-[400px] overflow-y-auto border border-gray-300 rounded">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2">Short Code</th>
              <th className="border border-gray-300 p-2">Target URL</th>
              <th className="border border-gray-300 p-2">Total Clicks</th>
              <th className="border border-gray-300 p-2">Last Clicked At</th>
              <th className="border border-gray-300 p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredLinks.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center p-4">
                  No links found.
                </td>
              </tr>
            ) : (
              filteredLinks.map((link) => (
                <tr key={link.code} className="hover:bg-gray-50">
                  <td className="border border-gray-300 p-2 font-mono text-blue-600">
                    <Link href={`/code/${link.code}`}>{link.code}</Link>
                  </td>
                  <td className="border border-gray-300 p-2 break-all">
                    {link.url.length > 32
                      ? "https://..." +
                        link.url.substring(link.url.length - 5, link.url.length)
                      : link.url}
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    {link.clicks}
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    {link.lastClickedAt
                      ? new Date(link.lastClickedAt).toLocaleString()
                      : "Never"}
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    <button
                      onClick={() => handleDelete(link.code)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}
