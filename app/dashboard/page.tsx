import { auth } from "@clerk/nextjs/server";
import { Link2 } from "lucide-react";
import { getLinksByUserId } from "@/data/links";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { CreateLinkDialog } from "@/app/dashboard/create-link-dialog";
import { EditLinkDialog } from "@/app/dashboard/edit-link-dialog";
import { DeleteLinkDialog } from "@/app/dashboard/delete-link-dialog";

export default async function DashboardPage() {
  // route protection is handled by clerkMiddleware in proxy.ts
  const { userId } = await auth.protect();

  const userLinks = await getLinksByUserId(userId);

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-6 py-10">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold tracking-tight">My Links</h1>
        <CreateLinkDialog />
      </div>

      {userLinks.length === 0 ? (
        <Card>
          <CardHeader className="items-center text-center">
            <Link2 className="mb-2 size-8 text-muted-foreground" />
            <CardTitle>No links yet</CardTitle>
            <CardDescription>
              You haven&apos;t created any short links yet.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          {userLinks.map((link) => (
            <Card key={link.id}>
              <CardHeader>
                <div className="flex items-center justify-between gap-3">
                  <CardTitle className="truncate">{link.shortCode}</CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{link.clicks} clicks</Badge>
                    <EditLinkDialog link={link} />
                    <DeleteLinkDialog link={link} />
                  </div>
                </div>
                <CardDescription className="truncate">
                  {link.originalUrl}
                </CardDescription>
                <CardDescription className="mt-2">
                  Created{" "}
                  {link.createdAt.toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
