import Image from "next/image";
import { PanoramaShell } from "@/components/panoramic/PanoramaShell";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <header className="h-16 px-6 flex items-center justify-center border-b border-white/5 bg-slate-950/80 backdrop-blur-xl">
        <Image
          src="/AshwinShethFinalLogo.svg"
          alt="Ashwin Sheth Group"
          width={160}
          height={44}
          className="object-contain"
        />
      </header>
      <PanoramaShell />
    </main>
  );
}
