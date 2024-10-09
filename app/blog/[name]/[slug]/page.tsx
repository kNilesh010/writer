import prisma from "@/app/api/utils/db";
import { RenderArticle } from "@/app/components/dashboard/RenderArticle";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JSONContent } from "novel";

async function getData(slug: string) {
  const data = await prisma.post.findUnique({
    where: {
      slug: slug,
    },
    select: {
      title: true,
      image: true,
      articleContent: true,
      smallDescription: true,
      createdAt: true,
      id: true,
    },
  });

  if (!data) {
    return notFound();
  }
  return data;
}

export default async function SlugRoute({
  params,
}: {
  params: { slug: string; name: string };
}) {
  const data = await getData(params.slug);
  return (
    <>
      <div className="flex items-center gap-x-3 pt-10 pb-5">
        <Button className="gap-x-2" size={"icon"} variant={"outline"} asChild>
          <Link href={`/blog/${params.name}`}>
            <ArrowLeft className="size-4" />
          </Link>
        </Button>
        <h2 className="text-xl font-semibold">Go Back</h2>
      </div>
      <div className="flex flex-col items-center justify-center mb-10">
        <div className="m-auto w-full text-center md:w-7/12">
          <p className="m-auto my-10 w-10/12 text-sm font-light text-muted-foreground md:text-base">
            {data.createdAt.toDateString()}
          </p>
          <h1 className="mb-5 text-3xl font-semibold md:text-5xl">
            {data.title}
          </h1>
          <p className="m-auto w-10/12 text-sm font-light text-muted-foreground md:text-base line-clamp-3">
            {data.smallDescription}
          </p>
        </div>
      </div>
      <div className="relative mb-10 m-auto h-80 w-full max-w-screen-lg overflow-hidden md:mb-20 md:h-[450px] md:w-5/6 md:rounded-2xl lg:w-2/3">
        <Image
          className="w-full h-full object-cover"
          src={data.image}
          alt={data.title}
          width={1200}
          height={630}
          priority
        />
      </div>
      <RenderArticle json={data.articleContent as JSONContent} />
    </>
  );
}
