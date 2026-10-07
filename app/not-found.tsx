import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center relative px-6 overflow-hidden">
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none z-0"
        aria-hidden="true"
      >
        <h1 className="text-[25vw] font-bold text-zinc-900/40 select-none">404</h1>
      </div>

      <div className="w-full max-w-2xl bg-[#09090b] border border-zinc-800 rounded-xl shadow-2xl z-10 relative overflow-hidden flex flex-col">
        <div className="flex items-center px-4 py-3 border-b border-zinc-800 bg-zinc-950/50">
          <div className="flex gap-1.5" aria-hidden="true">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500/80 animate-pulse" />
            <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-green-500/80" />
          </div>
          <span className="text-xs font-mono text-zinc-500 ml-4">sys_router_error.log</span>
        </div>

        <div className="p-6 md:p-8 font-mono text-sm md:text-base">
          <p className="text-zinc-500 mb-2">// Trace route failed</p>
          <p className="text-zinc-300 mb-6">
            <span className="text-purple-400">await</span> system.
            <span className="text-blue-400">resolveRoute</span>(request.path);
          </p>
          <p className="text-red-400">{"> Exception: Architecture Node Disconnected"}</p>
          <p className="text-zinc-500 mt-1 mb-8 whitespace-pre-wrap">
            {"  at Module.locate (/core/routing:404:0)"}
          </p>

          <div className="border-t border-zinc-800/50 pt-6 flex flex-col sm:flex-row items-center gap-4">
            <Link
              href="/"
              className="bg-orange-500 hover:bg-orange-600 text-black px-6 py-2.5 rounded text-xs uppercase tracking-wider font-bold transition-colors w-full sm:w-auto text-center"
            >
              Reboot to Home
            </Link>
            <Link
              href="/work"
              className="text-zinc-400 hover:text-white px-6 py-2.5 rounded border border-zinc-800 hover:border-zinc-700 text-xs uppercase tracking-wider transition-colors w-full sm:w-auto text-center"
            >
              View Systems
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
