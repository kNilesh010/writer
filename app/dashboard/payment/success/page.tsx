import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";
import Link from "next/link";

export default function SuccessPage() {
  return (
    <div className="w-full flex flex-1 justify-center items-center">
      <Card className="w-[350px]">
        <div className="p-6">
          <div className="w-full flex justify-center">
            <Check className="size-10 p-2 rounded-full bg-green-500/20 text-green-500" />
          </div>
          <div className="mt-3 text-center font-semibold sm:mt-5 w-full">
            <h2 className="text-xl font-medium">Payment success</h2>
            <p className="text-sm text-muted-foreground mt-2">
              Thank you for your payment. Your subscription is active.
            </p>
            <Button asChild className="w-full mt-5">
              <Link href="/dashboard">Go Back to Dashboard</Link>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
