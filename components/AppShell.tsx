import AuthHeader from "@/components/AuthHeader";

export default function AppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,#0f172a,#020617_45%,#000000)] text-cyan-50 p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <AuthHeader />

        <div className="space-y-8">{children}</div>
      </div>
    </main>
  );
}