import { deleteArticleServerAction } from "@/app/actions";
import { SubmitButtons } from "@/app/components/dashboard/SubmitButtons";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export default function ArticleDeletePage({
  params,
}: {
  params: { articleId: string; siteId: string };
}) {
  return (
    <div className="flex flex-1 items-center justify-center">
      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle>
            Are you absolutely sure you want to delete this article?
          </CardTitle>
          <CardDescription>
            This action cannot be undone. It will remove all data associated
            with it.
          </CardDescription>
        </CardHeader>
        <CardFooter className="w-full justify-between flex">
          <Button variant="secondary" asChild>
            <Link href={`/dashboard/sites/${params.siteId}`}>Cancel</Link>
          </Button>
          <form action={deleteArticleServerAction}>
            <input type="hidden" name="articleId" value={params.articleId} />
            <input type="hidden" name="siteId" value={params.siteId} />
            <SubmitButtons variant="destructive" text="Delete" />
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}
