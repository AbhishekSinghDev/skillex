"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { authClient } from "@/lib/auth-client";
import { EMAIL_LOGIN_OTP_LENGTH } from "@/lib/constant";
import { OTPVerificationSchema } from "@/lib/zod-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, CheckCircle, Loader2Icon, RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface VerifyRequestFormProps {
  email: string;
}

const VerifyRequestForm = ({ email }: VerifyRequestFormProps) => {
  const router = useRouter();
  const [verifyPending, startVerifyTransition] = useTransition();
  const [resendPending, startResendTransition] = useTransition();

  const form = useForm<z.infer<typeof OTPVerificationSchema>>({
    resolver: zodResolver(OTPVerificationSchema),
    defaultValues: { otp: "" },
  });

  const handleVerifyOTP = async (otp: string) => {
    if (!email) {
      toast.error("Email not found. Please try signing in again.");
      router.push("/login");
      return;
    }

    startVerifyTransition(async () => {
      await authClient.signIn.emailOtp({
        email: email,
        otp: otp,
        fetchOptions: {
          onSuccess: () => {
            toast.success("Email verified successfully");
            router.push("/");
          },
          onError: (context) => {
            toast.error(context.error.message || "OTP verification failed");
            console.log(context);
          },
        },
      });
    });
  };

  const handleResendCode = async () => {
    if (!email) {
      toast.error("Email not found. Please try signing in again.");
      router.push("/login");
      return;
    }

    startResendTransition(async () => {
      await authClient.emailOtp.sendVerificationOtp({
        email: email,
        type: "sign-in",
        fetchOptions: {
          onSuccess: () => {
            toast.success("Verification code resent successfully");
            form.reset();
          },
          onError: () => {
            toast.error("Failed to resend verification code");
          },
        },
      });
    });
  };

  const onSubmit = (values: z.infer<typeof OTPVerificationSchema>) => {
    handleVerifyOTP(values.otp);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6"
        noValidate
      >
        <FormField
          control={form.control}
          name="otp"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm">Verification Code</FormLabel>
              <FormControl>
                <div className="flex justify-center">
                  <InputOTP
                    maxLength={EMAIL_LOGIN_OTP_LENGTH}
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                  >
                    <InputOTPGroup>
                      {Array.from({ length: EMAIL_LOGIN_OTP_LENGTH }).map(
                        (_, index) => (
                          <InputOTPSlot
                            key={index}
                            index={index}
                            className="h-12 w-12"
                          />
                        )
                      )}
                    </InputOTPGroup>
                  </InputOTP>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full"
          disabled={verifyPending || resendPending}
        >
          {verifyPending ? (
            <Loader2Icon className="animate-spin" />
          ) : (
            <CheckCircle />
          )}
          Verify Code
        </Button>

        <div className="flex items-center justify-between">
          <Button
            type="button"
            variant="ghost"
            onClick={() => router.push("/login")}
            disabled={verifyPending || resendPending}
          >
            <ArrowLeft />
            Back to Login
          </Button>

          <Button
            type="button"
            variant="ghost"
            onClick={handleResendCode}
            disabled={verifyPending || resendPending}
          >
            {resendPending ? (
              <Loader2Icon className="animate-spin" />
            ) : (
              <RotateCcw />
            )}
            Resend Code
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default VerifyRequestForm;
