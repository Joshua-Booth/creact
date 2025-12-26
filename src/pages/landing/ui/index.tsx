import { setPageTitle } from "@/shared/lib/page";

export default function Landing() {
  setPageTitle();

  return (
    <main className="container mx-auto h-full mt-12">
      <section>
        <h1 className="text-primary text-3xl font-bold text-center">
          React Frontend
        </h1>
        <h2 className="text-center">
          A project template for creating awesome React web apps.
        </h2>
      </section>
    </main>
  );
}
