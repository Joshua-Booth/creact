import { Outlet } from "react-router";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import Navigation from "@/components/Layout/Navigation";

export default function Layout() {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <Navigation />
      <Footer />
    </>
  );
}
