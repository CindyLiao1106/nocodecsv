export default function DashboardLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
      <div className="max-w-2xl mx-auto pt-12">
        <div className="text-center mb-8">
          <div className="h-8 bg-zinc-200 rounded w-48 mx-auto animate-pulse mb-2" />
          <div className="h-4 bg-zinc-100 rounded w-64 mx-auto animate-pulse" />
        </div>
        <div className="h-64 bg-zinc-50 rounded-xl border-2 border-dashed border-zinc-200 animate-pulse" />
      </div>
    </div>
  );
}
