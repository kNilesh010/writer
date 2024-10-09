import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { SubmitButtons } from "../dashboard/SubmitButtons";
import { createSubscription } from "@/app/actions";

interface iAppProps {
  id: number;
  CardTitle: string;
  CardDescription: string;
  CardPrice: string;
  benefits: string[];
}

export const PricingPlans: iAppProps[] = [
  {
    id: 1,
    CardTitle: "Freelancer",
    CardDescription: "For small teams or office",
    CardPrice: "$0",
    benefits: [
      "1 site included",
      "up to 1000 visitors per day",
      "2GB of free storage",
      "Help center access",
      "Email support",
    ],
  },
  {
    id: 2,
    CardTitle: "Business",
    CardDescription: "For startups and enterprises",
    CardPrice: "$99",
    benefits: [
      "unlimited sites included",
      "up to 100000 visitors per day",
      "10GB of storage",
      "Help center access",
      "Email support",
    ],
  },
];

export function PricingTable() {
  return (
    <>
      <div className="max-w-xl mx-auto text-center">
        <p className="font-semibold text-2xl text-primary">Pricing</p>
        <h1 className="text-xl font-semibold mt-2 sm:text-2xl">
          Pricing plan for everyone
        </h1>
      </div>
      <p className="mx-auto mt-6 max-w-2xl text-lg leading-1 text-muted-foreground">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Mollitia
        officia, quisquam soluta fugiat laborum veritatis minus quia commodi
        quos velit ut temporibus deserunt sunt at id, necessitatibus voluptates,
        tenetur debitis!
      </p>

      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-2">
        {PricingPlans.map((plan) => (
          <Card key={plan.id} className={plan.id === 2 ? "border-primary" : ""}>
            <CardHeader>
              <CardTitle>
                {plan.id == 2 ? (
                  <div className=" flex justify-between items-center">
                    <h3 className="text-primary">Startup</h3>
                    <p className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold leading-5 text-primary">
                      Most Popular
                    </p>
                  </div>
                ) : (
                  <>{plan.CardTitle}</>
                )}
              </CardTitle>
              <CardDescription>{plan.CardDescription}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mt-6 text-4xl font-bold">{plan.CardPrice}</p>
              <ul className="text-sm mt-8 space-y-4 leading-6 text-muted-foreground">
                {plan.benefits.map((benefit) => (
                  <li key={benefit} className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-4 h-4 mr-2"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.567a.75.75 0 00-1.214-.883l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {benefit}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              {plan.id == 2 ? (
                <form className="w-full" action={createSubscription}>
                  <SubmitButtons
                    classname="w-full"
                    text="Buy Now"
                    variant="default"
                  />
                </form>
              ) : (
                <Button asChild variant="default" className="w-full">
                  <Link href="/dashboard">Try for free</Link>
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </>
  );
}
