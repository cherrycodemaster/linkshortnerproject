import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { SignUpButton } from "@clerk/nextjs";
import {
  Link2,
  BarChart2,
  Shield,
  Zap,
  Globe,
  Copy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const features = [
  {
    icon: Link2,
    title: "Instant Short Links",
    description:
      "Turn any long URL into a clean, shareable short link in seconds.",
  },
  {
    icon: BarChart2,
    title: "Click Analytics",
    description:
      "Track how many times each link has been clicked from your dashboard.",
  },
  {
    icon: Shield,
    title: "Secure & Reliable",
    description:
      "All links are stored safely and resolve reliably every time.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description:
      "Redirects happen in milliseconds so your audience never has to wait.",
  },
  {
    icon: Globe,
    title: "Share Anywhere",
    description:
      "Use your short links in emails, social posts, QR codes, or docs.",
  },
  {
    icon: Copy,
    title: "One-Click Copy",
    description:
      "Copy your new short URL to the clipboard instantly from the dashboard.",
  },
];

export default async function Home() {
  const { userId } = await auth();

  if (userId) {
    redirect("/dashboard");
  }

  return (
    <div className="flex flex-col flex-1">
      {/* Hero */}
      <section className="flex flex-col items-center gap-6 px-6 py-24 text-center">
        <Badge variant="secondary" className="text-sm">
          Free to get started
        </Badge>
        <h1 className="max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
          Shorten links.
          <br />
          <span className="text-primary">Track every click.</span>
        </h1>
        <p className="max-w-xl text-lg text-muted-foreground">
          Link Shortener turns unwieldy URLs into tidy, shareable links — and
          gives you real-time analytics to see exactly how they perform.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <SignUpButton mode="modal">
            <Button size="lg" className="px-8">
              Get started for free
            </Button>
          </SignUpButton>
        </div>
      </section>

      {/* Features */}
      <section className="bg-muted/40 px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-12 text-center text-3xl font-semibold tracking-tight">
            Everything you need to manage links
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(({ icon: Icon, title, description }) => (
              <Card key={title}>
                <CardHeader>
                  <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="size-5" />
                  </div>
                  <CardTitle>{title}</CardTitle>
                  <CardDescription>{description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="flex flex-col items-center gap-6 px-6 py-24 text-center">
        <h2 className="text-3xl font-semibold tracking-tight">
          Ready to shorten your first link?
        </h2>
        <p className="max-w-md text-muted-foreground">
          Create a free account and start building your link library in under a
          minute.
        </p>
        <SignUpButton mode="modal">
          <Button size="lg" className="px-8">
            Sign up — it&apos;s free
          </Button>
        </SignUpButton>
      </section>
    </div>
  );
}
