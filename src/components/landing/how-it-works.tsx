export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-zinc-50 py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Three steps to your first insight
          </h2>
        </div>
        <div className="grid gap-8 sm:grid-cols-3">
          {[
            { step: "1", title: "Upload", desc: "Drag your CSV, Excel, or TSV file. Works with files up to 25MB." },
            { step: "2", title: "Ask", desc: "Type any question — \"Summarize sales by region\", \"Find outliers in column B\"." },
            { step: "3", title: "Insights", desc: "AI analyzes, computes, and visualizes. Download chart + answer as PNG or CSV." },
          ].map((item) => (
            <div key={item.step} className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white text-xl font-bold mb-4">
                {item.step}
              </div>
              <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
              <p className="text-zinc-500 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
