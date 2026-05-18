type DatasetDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function DatasetDetailPage({
  params,
}: DatasetDetailPageProps) {
  const { id } = await params;

  return (
    <main className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <section>
          <h1 className="text-4xl font-bold">Dataset Detail</h1>
          <p className="text-slate-400 mt-2">
            Dataset ID: <span className="text-white">{id}</span>
          </p>
        </section>
      </div>
    </main>
  );
}