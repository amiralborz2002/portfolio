import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center relative px-6 overflow-hidden">
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none z-0"
        aria-hidden="true"
      >
        <h1 className="text-[25vw] font-bold text-zinc-900/30 select-none">404</h1>
      </div>

      <div className="w-full max-w-2xl bg-zinc-950/60 backdrop-blur-2xl border border-zinc-800/50 rounded-xl shadow-2xl z-10 relative flex flex-col">
        <div className="flex items-center px-4 py-3 border-b border-zinc-800/50 bg-zinc-950/50 rounded-t-xl">
          <div className="flex gap-1.5" aria-hidden="true">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500/80 animate-pulse" />
            <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-green-500/80" />
          </div>
          <span className="text-xs font-mono text-zinc-500 ml-4">system_message.log</span>
        </div>

        <div className="p-6 md:p-8 font-mono text-sm md:text-base">
          <p className="text-orange-400 mb-4">ERR // 404_PAGE_NOT_FOUND</p>
          <p className="text-zinc-300 mb-2">
            {">"} It seems you&apos;ve ventured into the unknown.
          </p>
          <p className="text-zinc-300 mb-8">
            {">"} The page you are looking for doesn&apos;t exist or has been
            moved. Don&apos;t worry, the rest of the architecture is working
            perfectly.
          </p>

          <div className="border-t border-zinc-800/50 pt-6 flex flex-col sm:flex-row items-center gap-4">
            <Button href="/" variant="primary" className="w-full uppercase tracking-wider sm:w-auto">
              Reboot to Home
            </Button>
            <Button href="/work" variant="secondary" className="w-full uppercase tracking-wider sm:w-auto">
              View Work
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
