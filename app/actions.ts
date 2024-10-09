"use server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { parseWithZod } from "@conform-to/zod";
import {
  postSchema,
  siteSchema,
  siteValidationSchema,
} from "./api/utils/zodSchemas";
import prisma from "./api/utils/db";
import { redirect } from "next/navigation";
import { requireUser } from "./api/utils/requireUser";
import { stripe } from "./api/utils/stripe";

export async function createSiteServerAction(
  prevState: any,
  formData: FormData
) {
  const user = await requireUser();

  const [substatus, sites] = await Promise.all([
    prisma.subscription.findUnique({
      where: {
        userId: user.id,
      },
      select: {
        status: true,
      },
    }),
    prisma.site.findMany({
      where: {
        userId: user.id,
      },
    }),
  ]);

  if (!substatus || substatus.status !== "active") {
    if (sites.length < 1) {
      await createSite();
    } else {
      return redirect(`/dashboard/pricing`);
    }
  } else if (substatus.status === "active") {
    await createSite();
  }

  async function createSite() {
    const submission = await parseWithZod(formData, {
      schema: siteValidationSchema({
        isSubdirectoryUnique: async () => {
          const site = await prisma.site.findFirst({
            where: {
              subdirectory: formData.get("subdirectory") as string,
              userId: user.id,
            },
          });
          return !site;
        },
      }),
      async: true,
    });

    if (submission.status !== "success") {
      return submission.reply();
    }

    const response = await prisma.site.create({
      data: {
        name: submission.value.name,
        subdirectory: submission.value.subdirectory,
        description: submission.value.description,
        userId: user.id,
      },
    });
  }
  return redirect(`/dashboard/sites`);
}

export async function createArticleServerAction(
  prevState: any,
  formData: FormData
) {
  const user = await requireUser();

  const submission = parseWithZod(formData, {
    schema: postSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  const response = await prisma.post.create({
    data: {
      title: submission.value.title,
      slug: submission.value.slug,
      smallDescription: submission.value.smallDescription,
      image: submission.value.image,
      articleContent: JSON.parse(submission.value.articleContent),
      userId: user.id,
      siteId: formData.get("siteId") as string,
    },
  });
  return redirect(`/dashboard/sites/${formData.get("siteId")}`);
}

export async function updateArticleServerAction(
  prevState: any,
  formData: FormData
) {
  const user = await requireUser();

  const submission = parseWithZod(formData, { schema: postSchema });
  if (submission.status !== "success") {
    return submission.reply();
  } else {
    const response = await prisma.post.update({
      where: {
        userId: user.id,
        id: formData.get("articleId") as string,
      },
      data: {
        title: submission.value.title,
        slug: submission.value.slug,
        smallDescription: submission.value.smallDescription,
        image: submission.value.image,
        articleContent: JSON.parse(submission.value.articleContent),
      },
    });
    return redirect(`/dashboard/sites/${formData.get("siteId")}`);
  }
}

export async function deleteArticleServerAction(formData: FormData) {
  const user = await requireUser();
  const response = await prisma.post.delete({
    where: {
      userId: user.id,
      id: formData.get("articleId") as string,
    },
  });
  return redirect(`/dashboard/sites/${formData.get("siteId")}`);
}

export async function updateImageServerAction(formData: FormData) {
  const user = await requireUser();
  const response = await prisma.site.update({
    where: {
      userId: user.id,
      id: formData.get("siteId") as string,
    },
    data: {
      imageUrl: formData.get("imageUrl") as string,
    },
  });
  return redirect(`/dashboard/sites/${formData.get("siteId")}`);
}

export async function deleteSiteServerAction(formData: FormData) {
  const user = await requireUser();
  const response = await prisma.site.delete({
    where: {
      userId: user.id,
      id: formData.get("siteId") as string,
    },
  });
  return redirect(`/dashboard/sites`);
}

export async function createSubscription() {
  const user = await requireUser();

  let stripeUserId = await prisma.user.findUnique({
    where: {
      id: user.id,
    },
    select: {
      customerId: true,
      email: true,
      firstname: true,
    },
  });

  if (!stripeUserId?.customerId) {
    const stripeUser = await stripe.customers.create({
      email: stripeUserId?.email,
      name: stripeUserId?.firstname,
    });

    stripeUserId = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        customerId: stripeUser.id,
      },
    });
  }

  const session = await stripe.checkout.sessions.create({
    success_url: "http://localhost:3000/dashboard/payment/success",
    cancel_url: "http://localhost:3000/dashboard/payment/cancel",
    payment_method_types: ["card"],
    mode: "subscription",
    customer: stripeUserId.customerId as string,
    billing_address_collection: "auto",
    customer_update: {
      address: "auto",
      name: "auto",
    },
    line_items: [
      { price: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID, quantity: 1 },
    ],
  });
  return redirect(session.url as string);
}
