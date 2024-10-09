import prisma from "@/app/api/utils/db";
import { EditArticleForm } from "@/app/components/dashboard/forms/EditArticleForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

async function getData(articleId: string) {
  const data = await prisma.post.findUnique({
    where: {
      id: articleId,
    },
    select: {
      image: true,
      title: true,
      smallDescription: true,
      slug: true,
      articleContent: true,
      id: true,
    },
  });

  if (!data) {
    return notFound();
  }
  return data;
}

export default async function EditPostRoute({
  params,
}: {
  params: { articleId: string; siteId: string };
}) {
  const data = await getData(params.articleId);
  return (
    <div>
      <div className="flex items-center">
        <Button variant="outline" size="icon" asChild>
          <Link href={`/dashboard/sites/${params.siteId}`}>
            <ArrowLeft className="size-4" />
          </Link>
        </Button>
        <h1 className="font-semibold text-2xl ml-4">Edit Article</h1>
      </div>
      <EditArticleForm data={data} siteId={params.siteId} />
    </div>
  );
}
