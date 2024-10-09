import prisma from "@/app/api/utils/db";
import { ThemeToggle } from "@/app/components/dashboard/ThemeToggle";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

async function getData(subDir: string) {
  const data = await prisma.site.findUnique({
    where: {
      subdirectory: subDir,
    },
    select: {
      name: true,
      Posts: {
        select: {
          smallDescription: true,
          image: true,
          title: true,
          createdAt: true,
          id: true,
          slug: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 5,
      },
    },
  });

  if (!data) {
    return notFound();
  }
  return data;
}

export default async function BlogPage({
  params,
}: {
  params: { name: string };
}) {
  const data = await getData(params.name);
  return (
    <>
      <nav className="grid grid-cols-3 my-10">
        <div className="col-span-1" />
        <div className="flex items-center gap-x-2 justify-center">
          <Image
            src="/logo.png"
            alt="logo"
            width={50}
            height={50}
            className=""
          />
          <h1 className="font-semibold text-2xl">{data.name}</h1>
        </div>
        <div className="col-span-1 flex w-full justify-end ">
          <ThemeToggle />
        </div>
      </nav>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
        {data.Posts.map((site) => (
          <Card key={site.id}>
            <Image
              src={site.image ?? ""}
              alt={site.title}
              className="rounded-t-lg object-cover w-full h-[200px]"
              width={400}
              height={200}
            />
            <CardHeader>
              <CardTitle className="truncate">{site.title}</CardTitle>
              <CardDescription className="line-clamp-2">
                {site.smallDescription}
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href={`/blog/${params.name}/${site.slug}`}>
                  Read More
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </>
  );
}
