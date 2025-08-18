import Logo from "@/components/shared/logo";
import { redirect } from "next/navigation";
import VerifyRequestForm from "./verify-request-form";

interface VerifyRequestPageProps {
  searchParams?: Promise<{ email?: string }>;
}

const VerifyRequestPage = async ({ searchParams }: VerifyRequestPageProps) => {
  const email = (await searchParams)?.email;

  if (!email) redirect("/login");

  return (
    <div className="max-w-92 m-auto h-fit w-full">
      <div className="p-6">
        <div>
          <Logo />
          <h1 className="mb-1 mt-4 text-xl font-semibold">Verify Your Email</h1>
          <p className="text-muted-foreground">
            {email
              ? `We've sent a verification code to ${email}`
              : "Enter the verification code sent to your email"}
          </p>
        </div>

        <div className="mt-6">
          <div className="rounded-lg border bg-muted/50 p-4 mb-6">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center mt-0.5">
                <div className="w-2 h-2 rounded-full bg-blue-600"></div>
              </div>
              <div className="text-sm space-y-1">
                <p className="font-medium">Check your email</p>
                <p className="text-muted-foreground">
                  The verification code expires in 10 minutes. If you don&apos;t
                  see the email, check your spam folder.
                </p>
              </div>
            </div>
          </div>

          <VerifyRequestForm email={email} />
        </div>
      </div>
    </div>
  );
};

export default VerifyRequestPage;
