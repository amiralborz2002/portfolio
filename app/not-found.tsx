import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-6">
      <div className="max-w-2xl w-full text-center flex flex-col items-center">
        <div className="text-orange-400 font-mono text-sm mb-6">ERR // 404</div>
        <h1 className="text-3xl md:text-5xl font-mono font-bold text-white tracking-tight mb-6">
          {"> NODE_DISCONNECTED"}
          <span className="animate-pulse">_</span>
        </h1>
        <p className="text-zinc-400 font-mono text-sm md:text-base leading-relaxed max-w-lg mb-10">
          The requested route could not be resolved in the current system
          architecture. The node may have been moved, deleted, or never existed.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-black px-6 py-3 rounded-full transition-colors group font-mono text-sm"
        >
          <span>cd /home</span>
          <span className="opacity-70 group-hover:opacity-100">↵</span>
        </Link>
      </div>
    </div>
  );
}
