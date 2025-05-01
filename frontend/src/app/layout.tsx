import "./globals.css";
import { Navbar } from "@/components/Navbar";
import "@fontsource/sora/400.css";
import "@fontsource/sora/700.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ClientProviders from "@/components/ClientProviders";

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
      <body className="font-sans bg-zinc-100">
        <ClientProviders>
          <Navbar />

          <main className="mx-auto">{children}</main>
        </ClientProviders>
      </body>
    </html>
  );
}
