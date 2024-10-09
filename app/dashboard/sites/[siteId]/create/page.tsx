"use client";
import { createArticleServerAction } from "@/app/actions";
import { UploadDropzone } from "@/app/api/utils/UploadThingComponents";
import { postSchema } from "@/app/api/utils/zodSchemas";
import TailwindEditor from "@/app/components/dashboard/EditorWrapper";
import { SubmitButtons } from "@/app/components/dashboard/SubmitButtons";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { Arrow, Label } from "@radix-ui/react-dropdown-menu";
import { ArrowLeft, Atom } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { JSONContent } from "novel";
import { useActionState, useState } from "react";
import slugify from "react-slugify";

export default function ArticleCreationPage({
  params,
}: {
  params: { siteId: string };
}) {
  const [imageUrl, setImageUrl] = useState<undefined | string>(undefined);
  const [value, setValue] = useState<JSONContent | undefined>(undefined);
  const [title, setTitle] = useState<undefined | string>(undefined);
  const [slug, setSlug] = useState<undefined | string>(undefined);

  const [lastResult, action] = useActionState(
    createArticleServerAction,
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
    <>
      <div className="flex items-center">
        <Button size="icon" variant="outline" className="mr-3" asChild>
          <Link href={`/dashboard/sites/${params.siteId}`}>
            <ArrowLeft className="size-4" />
          </Link>
        </Button>
        <h1 className="font-semibold text-xl">Create Article</h1>
      </div>
      <Card>
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
            <input type="hidden" name="siteId" value={params.siteId} />
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
                defaultValue={fields.smallDescription.initialValue}
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
            <SubmitButtons text="Create Post" />
          </form>
        </CardContent>
      </Card>
    </>
  );
}
