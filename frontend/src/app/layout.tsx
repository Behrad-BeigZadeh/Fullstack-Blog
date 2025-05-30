import "./globals.css";
import { Navbar } from "@/components/Navbar";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Sora } from "next/font/google";
import ClientProviders from "@/components/ClientProviders";

const sora = Sora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata = {
  title: "MyBlog",
  description: "A clean and modern personal blog",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${sora.className} font-sans bg-zinc-100`}>
        <ClientProviders>
          <Navbar />

          <main className="mx-auto">{children}</main>
        </ClientProviders>
      </body>
    </html>
  );
}
