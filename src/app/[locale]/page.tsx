import { routing } from "@/i18n/routing";
import HomeClient from "./home-client";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default function Page() {
  return <HomeClient />;
}
