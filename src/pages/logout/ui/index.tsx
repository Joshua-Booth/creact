import { setPageTitle } from "@/shared/lib/page";

export default function Logout() {
  setPageTitle("Logout");

  return (
    <main className="content-container">
      <h1 className="pb-1">Logout</h1>
      <p>Logging out...</p>
    </main>
  );
}
