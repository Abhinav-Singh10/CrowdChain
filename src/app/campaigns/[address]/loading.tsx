import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-white">
      <Navbar />
      <main className="flex-1">
        <div className="relative h-64 w-full overflow-hidden md:h-80 lg:h-96">
          <Skeleton className="h-full w-full" />
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="md:col-span-2">
              <Skeleton className="mb-4 h-10 w-3/4" />
              <Skeleton className="mb-6 h-4 w-full" />
              <Skeleton className="mb-6 h-4 w-full" />
              <Skeleton className="mb-6 h-4 w-2/3" />

              <Skeleton className="mb-4 h-8 w-full" />

              <div className="grid gap-4 sm:grid-cols-2">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
              </div>
            </div>

            <div>
              <Skeleton className="mb-6 h-64 w-full" />
              <Skeleton className="mb-6 h-64 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
