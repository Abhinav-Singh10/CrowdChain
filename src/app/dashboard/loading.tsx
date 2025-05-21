import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-white">
      <Navbar />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-20">
          <div className="mb-8 flex items-center">
            <Skeleton className="mr-4 h-16 w-16 rounded-full" />
            <div>
              <Skeleton className="mb-2 h-8 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>

          <Skeleton className="mb-8 h-32 w-full" />

          <Skeleton className="mb-6 h-12 w-full" />

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Skeleton className="h-96 w-full" />
            <Skeleton className="h-96 w-full" />
            <Skeleton className="h-96 w-full" />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
