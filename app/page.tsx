import { redirect } from "next/navigation";

export default function Home() {
  redirect("/select-card");
  return null;
}
