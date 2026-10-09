import type { Metadata } from "next";
import { ContactHero } from "@/components/sections/contact/ContactHero";

export const metadata: Metadata = {
  title: "Contact",
  description: "Reach Amir Alborz directly by email or phone.",
};

export default function ContactPage() {
  return <ContactHero />;
}
