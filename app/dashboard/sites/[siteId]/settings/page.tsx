import { deleteSiteServerAction } from "@/app/actions";
import { SubmitButtons } from "@/app/components/dashboard/SubmitButtons";
import { UploadImageForm } from "@/app/components/dashboard/forms/UploadImageForm";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function SettingsSiteRoute({
  params,
}: {
  params: { siteId: string };
}) {
  return (
    <>
      <div className="flex items-center gap-x-2">
        <Button size="icon" variant="outline">
          <Link href={`/dashboard/sites/${params.siteId}`}>
            <ChevronLeft className="size-4" />
          </Link>
        </Button>
        <h3 className="text-xl font-semibold">Go Back</h3>
      </div>
      <UploadImageForm siteId={params.siteId} />
      <Card className="border-red-500 bg-red-500/10">
        <CardHeader>
          <CardTitle className="text-red-500">Danger</CardTitle>
          <CardDescription>
            This will delete the site and all articles associated with it.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <form action={deleteSiteServerAction}>
            <input type="hidden" name="siteId" value={params.siteId} />
            <SubmitButtons text="Delete Everything" variant="destructive" />
          </form>
        </CardFooter>
      </Card>
    </>
  );
}
