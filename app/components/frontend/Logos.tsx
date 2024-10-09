import kindLogo from "@/public/kinde.svg";
import Image from "next/image";
import nextJsLogo from "@/public/nextjs.svg";
import vercelLogo from "@/public/vercel-logo.svg";
export function Logos() {
  return (
    <div className="py-8">
      <h2 className="text-center text-lg font-semibold">
        Trusted by over 1000 of people
      </h2>
      <div className=" mt-10 grid max-w-lg mx-auto grid-cols-3 items-center gap-x-8 gap-y-10 sm:max-w-xl sm:grid-cols-6 sm:gap-x-10 lg:mx-0 lg:max-w-none lg:grid-cols-3">
        <Image
          src={kindLogo}
          alt="Kind Logo"
          className="dark:invert col-span-2 max-h-12 w-full object-contain lg:col-span-1"
        />
        <Image
          src={nextJsLogo}
          alt="Kind Logo"
          className="dark:invert col-span-2 max-h-12 w-full object-contain lg:col-span-1"
        />
        <Image
          src={vercelLogo}
          alt="Kind Logo"
          className="dark:invert col-span-2 max-h-12 w-full object-contain lg:col-span-1"
        />
      </div>
    </div>
  );
}
