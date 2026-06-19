import { createFileRoute, Outlet } from "@tanstack/react-router";
import Footer from "~/components/shared/Footer";
import Header from "~/components/shared/Header";

export const Route = createFileRoute('/_landing')({
  component: LandingLayout,
})

function LandingLayout() {
  return (
<>
<Header />
  <Outlet />
<Footer />
</>
  );
}
