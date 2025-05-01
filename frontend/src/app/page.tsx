"use client";
import TopPosts from "@/components/TopPosts";
import dynamic from "next/dynamic";
import Link from "next/link";

const NewPosts = dynamic(() => import("@/components/NewPosts"), { ssr: false });

export default function HomePage() {
  return (
    <section className="min-h-screen text-zinc-900 px-6 sm:px-2 py-10">
      <div className=" space-y-10">
        {/* Latest Posts */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl sm:text-5xl italic font-bold tracking-wide text-zinc-900">
            Latest Posts
          </h1>
          <Link
            href="/posts"
            className="text-zinc-800 hover:text-zinc-900 underline italic transition font-medium"
          >
            View All →
          </Link>
        </div>

        <NewPosts />

        {/* Top Posts */}

        <div className="flex items-center justify-between">
          <h1 className="text-3xl sm:text-5xl italic font-bold tracking-wide text-zinc-900">
            Top Posts
          </h1>
          <Link
            href="/posts"
            className="text-zinc-800 hover:text-zinc-900 underline italic transition font-medium"
          >
            View All →
          </Link>
        </div>
        <TopPosts />
      </div>
    </section>
  );
}
