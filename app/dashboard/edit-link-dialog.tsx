"use client";

import { useState, useTransition } from "react";
import { PencilIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateLinkAction } from "@/app/dashboard/actions";

type EditLinkDialogProps = Readonly<{
  link: {
    id: number;
    originalUrl: string;
    shortCode: string;
  };
}>;

export function EditLinkDialog({ link }: EditLinkDialogProps) {
  const [open, setOpen] = useState(false);
  const [originalUrl, setOriginalUrl] = useState(link.originalUrl);
  const [shortCode, setShortCode] = useState(link.shortCode);
  const [isPending, startTransition] = useTransition();

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    if (nextOpen) {
      // reset to the latest saved values each time the dialog opens
      setOriginalUrl(link.originalUrl);
      setShortCode(link.shortCode);
    }
  }

  function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    startTransition(async () => {
      const result = await updateLinkAction({
        id: link.id,
        originalUrl: originalUrl.trim(),
        shortCode: shortCode.trim(),
      });

      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success("Link updated successfully.");
      handleOpenChange(false);
    });
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          <Button variant="ghost" size="icon-sm">
            <PencilIcon />
            <span className="sr-only">Edit link</span>
          </Button>
        }
      />
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit link</DialogTitle>
            <DialogDescription>
              Update the destination URL or short code for this link.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4 py-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor={`originalUrl-${link.id}`}>
                Destination URL
              </Label>
              <Input
                id={`originalUrl-${link.id}`}
                type="url"
                placeholder="https://example.com/my-long-url"
                value={originalUrl}
                onChange={(event) => setOriginalUrl(event.target.value)}
                required
                disabled={isPending}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor={`shortCode-${link.id}`}>Short code</Label>
              <Input
                id={`shortCode-${link.id}`}
                type="text"
                placeholder="my-link"
                value={shortCode}
                onChange={(event) => setShortCode(event.target.value)}
                required
                disabled={isPending}
              />
              <p className="text-xs text-muted-foreground">
                Only letters, numbers, hyphens and underscores. Changing this
                will break any links already shared with this short code.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
