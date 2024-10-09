"use client";

import { UploadDropzone } from "@/app/api/utils/UploadThingComponents";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@radix-ui/react-dropdown-menu";
import { Atom } from "lucide-react";
import Image from "next/image";
import { SubmitButtons } from "../SubmitButtons";
import TailwindEditor from "../EditorWrapper";
import { useActionState, useState } from "react";
import { JSONContent } from "novel";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import {
  createArticleServerAction,
  updateArticleServerAction,
} from "@/app/actions";
import { postSchema } from "@/app/api/utils/zodSchemas";
import slugify from "react-slugify";
import { Prisma } from "@prisma/client";

interface iAppProps {
  data: {
    title: string;
    slug: string;
    smallDescription: string;
    image: string;
    articleContent: any;
    id: string;
  };
  siteId: string;
}

export function EditArticleForm({ data, siteId }: iAppProps) {
  const [imageUrl, setImageUrl] = useState<undefined | string>(data.image);
  const [value, setValue] = useState<JSONContent | undefined>(
    data.articleContent
  );
  const [title, setTitle] = useState<undefined | string>(data.title);
  const [slug, setSlug] = useState<undefined | string>(data.slug);

  const [lastResult, action] = useActionState(
    updateArticleServerAction,
    undefined
  );

  const [form, fields] = useForm({
    lastResult,
    onValidate: ({ formData }) => {
      return parseWithZod(formData, {
        schema: postSchema,
      });
    },

    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });

  function handleSlugGenerate() {
    const titleInput = title;
    if (titleInput?.length == 0 || titleInput == undefined) {
      throw new Error("Title cannot be empty");
    }

    setSlug(slugify(titleInput));
  }

  return (
    <Card className="mt-5">
      <CardHeader>
        <CardTitle>Article Details</CardTitle>
        <CardDescription>Please enter some details here</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          className="flex flex-col gap-6"
          id={form.id}
          onSubmit={form.onSubmit}
          action={action}
        >
          <input type="hidden" name="articleId" value={data.id} />
          <input type="hidden" name="siteId" value={siteId} />
          <div className="grid gap-2">
            <Label>Title</Label>
            <input
              key={fields.title.key}
              name={fields.title.name}
              defaultValue={fields.title.initialValue}
              placeholder="Please enter post title"
              onChange={(e) => setTitle(e.target.value)}
              value={title}
            />
            <p className="text-red-500 text-sm">{fields.title.errors}</p>
          </div>
          <div className="grid gap-2">
            <Label>Slug</Label>
            <input
              key={fields.slug.key}
              name={fields.slug.name}
              defaultValue={fields.slug.initialValue}
              placeholder="Article Slug"
              onChange={(e) => setSlug(e.target.value)}
              value={slug}
            />

            <Button
              onClick={handleSlugGenerate}
              className="w-fit"
              variant="secondary"
              type="button"
            >
              <Atom className="size-4 mr-2" />
              Generate Slug
            </Button>
            <p className="text-red-500 text-sm">{fields.slug.errors}</p>
          </div>

          <div className="grid gap-2">
            <Label>Please enter short description</Label>
            <Textarea
              key={fields.smallDescription.key}
              name={fields.smallDescription.name}
              defaultValue={data.smallDescription}
              className="h-32"
              placeholder="Short description for your post"
            />
            <p className="text-red-500 text-sm">{fields.slug.errors}</p>
          </div>

          <div className="grid gap-2">
            <Label>Cover Image</Label>
            <input
              type="hidden"
              name={fields.image.name}
              key={fields.image.key}
              defaultValue={fields.image.initialValue}
              value={imageUrl}
            />

            {imageUrl ? (
              <Image
                className="object-cover w-[200px] h-[200px] rounded-lg"
                src={imageUrl}
                width={200}
                height={200}
                alt="cover"
              />
            ) : (
              <UploadDropzone
                endpoint="imageUploader"
                onClientUploadComplete={(res) => {
                  setImageUrl(res[0].url);
                }}
                onUploadError={(error) => {
                  throw new Error("Something went wrong", { cause: error });
                }}
              />
            )}
            <p className="text-red-500 text-sm">{fields.image.errors}</p>
          </div>
          <div className="grid gap-2">
            <Label>Article Content</Label>
            <input
              type="hidden"
              name={fields.articleContent.name}
              key={fields.articleContent.key}
              defaultValue={fields.articleContent.initialValue}
              value={JSON.stringify(value)}
            />
            <TailwindEditor initialValue={value} onchange={setValue} />
            <p className="text-red-500 text-sm">
              {fields.articleContent.errors}
            </p>
          </div>
          <SubmitButtons text="Update Post" />
        </form>
      </CardContent>
    </Card>
  );
}
