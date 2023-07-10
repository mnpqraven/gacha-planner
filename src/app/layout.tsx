import Navbar from "./components/Navbar";
import Providers from "./components/Providers";
import "@/css/globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Honkai Star Rail Gacha Planner",
  description: "Honkai Star Rail Gacha Planner",
};

type RootProps = {
  children: React.ReactNode;
};
export default function RootLayout({ children }: RootProps) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
