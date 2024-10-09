import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import prisma from "../api/utils/db";
import { requireUser } from "../api/utils/requireUser";
import { EmptyStateForm } from "../components/dashboard/forms/EmptyStateForm";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

async function getData(userId: string) {
  const [sites, articles] = await Promise.all([
    prisma.site.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
    }),
    prisma.post.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
    }),
  ]);

  // const sites = await prisma.site.findMany({
  //   where: {
  //     userId: userId,
  //   },
  //   orderBy: {
  //     createdAt: "desc",
  //   },
  //   take: 5,
  // });

  // const articles = await prisma.post.findMany({
  //   where: {
  //     userId: userId,
  //   },
  //   orderBy: {
  //     createdAt: "desc",
  //   },
  //   take: 5,
  // });

  return {
    sites,
    articles,
  };
}

export default async function Dashboard() {
  const user = await requireUser();
  const { sites, articles } = await getData(user.id);
  return (
    <div>
      <h1 className="font-semibold text-2xl mt-4 mb-5">Your Sites</h1>
      {sites.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {sites.map((site) => (
            <Card key={site.id}>
              <Image
                src={site.imageUrl ?? ""}
                alt={site.name}
                className="rounded-t-lg object-cover w-full h-[200px]"
                width={400}
                height={200}
              />
              <CardHeader>
                <CardTitle className="truncate">{site.name}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {site.description}
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link href={`/dashboard/sites/${site.id}`}>
                    View Articles
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyStateForm
          title="You don't have any Sites created yet"
          description="Please create a new site, so that you can start writing"
          buttonText="Create Site"
          href="/dashboard/sites/new"
        />
      )}
      <h1 className="font-semibold text-2xl mt-8 mb-5">Recent Articles</h1>
      {articles.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {articles.map((site) => (
            <Card key={site.id}>
              <Image
                src={site.image}
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
                  <Link href={`/dashboard/sites/${site.siteId}/${site.id}`}>
                    Edit Articles
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyStateForm
          title="You don't have any Articles created yet"
          description="Please create a new article, so that you can start writing"
          buttonText="Create Article"
          href={`/dashboard/sites/`}
        />
      )}
    </div>
  );
}
