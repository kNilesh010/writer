"use client";
import { UploadDropzone } from "@/app/api/utils/UploadThingComponents";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { useState } from "react";
import { SubmitButtons } from "../SubmitButtons";
import { updateImageServerAction } from "@/app/actions";

interface iAppProps {
  siteId: string;
}

export function UploadImageForm({ siteId }: iAppProps) {
  const [imageUrl, setImageUrl] = useState<undefined | string>(undefined);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Image</CardTitle>
        <CardDescription>
          This is the image of your site. Click to select an image
        </CardDescription>
      </CardHeader>
      <CardContent>
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt="Upload Image"
            width={200}
            height={200}
            className="size-[200px] object-cover rounded-md"
          />
        ) : (
          <UploadDropzone
            endpoint="imageUploader"
            onClientUploadComplete={(data) => setImageUrl(data[0].url)}
            onUploadError={(err) => console.log(err)}
          />
        )}
      </CardContent>
      <CardFooter>
        <form action={updateImageServerAction}>
          <input type="hidden" name="siteId" value={siteId} />
          <input type="hidden" name="imageUrl" value={imageUrl} />
          <SubmitButtons text="Change Image" />
        </form>
      </CardFooter>
    </Card>
  );
}
