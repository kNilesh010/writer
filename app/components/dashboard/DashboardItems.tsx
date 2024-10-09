"use client";
import { dashboardItems } from "@/app/dashboard/layout";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DashboardItems() {
  const pathName = usePathname();
  return (
    <ul className="flex flex-col gap-2">
      {dashboardItems.map((item) => (
        <li key={item.name}>
          <Link
            href={item.href}
            className={cn(
              pathName === item.href
                ? "bg-muted text-primary"
                : "text-muted-foreground bg-none",
              "group flex items-center gap-2 rounded-md p-2 text-sm font-medium hover:text-primary/70"
            )}
          >
            <item.icon className="h-5 w-5 flex-none" aria-hidden="true" />
            <span className="flex-1">{item.name}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
