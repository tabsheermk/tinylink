export default function HealthzPage() {
  const data = { ok: true, version: "1.0" };

  return (
    <main className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
      <div className="p-6 bg-white rounded shadow text-center">
        <h1 className="text-3xl font-bold mb-4">Health Check</h1>
        <p className="mb-2">
          <strong>Status:</strong> {data.ok ? "Healthy ✅" : "Unhealthy ❌"}
        </p>
        <p>
          <strong>Version:</strong> {data.version}
        </p>
      </div>
    </main>
  );
}
