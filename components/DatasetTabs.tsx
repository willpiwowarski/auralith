"use client";

type Props = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
};

export default function DatasetTabs({
  activeTab,
  setActiveTab,
}: Props) {
  const tabs = ["Analytics", "Raw Data", "AI Insights"];

  return (
    <div className="flex gap-3 border-b border-slate-800 pb-4">
      {tabs.map((tab) => {
        const active = activeTab === tab;

        return (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-xl text-sm font-medium transition border ${
              active
               ? "bg-gradient-to-r from-cyan-400 to-violet-500 text-slate-950 border-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.25)]"
               : "bg-slate-950/70 text-cyan-300/70 border-cyan-500/10 hover:border-cyan-400/40 hover:text-cyan-200"
            }`}
          >
            {tab}
          </button>
        );
      })}
    </div>
  );
}