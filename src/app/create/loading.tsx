import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-white">
      <Navbar />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-20">
          <Skeleton className="mb-4 h-12 w-64 mx-auto" />
          <Skeleton className="mb-12 h-6 w-full max-w-2xl mx-auto" />

          <div className="mx-auto max-w-3xl">
            <Skeleton className="mb-8 h-12 w-full" />

            <Skeleton className="h-[600px] w-full" />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
