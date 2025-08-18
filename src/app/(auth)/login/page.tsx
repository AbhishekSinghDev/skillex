"use client";

import Logo from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { LoginSchema } from "@/lib/zod-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { GithubIcon, Loader2Icon, Send } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const LoginPage = () => {
  const router = useRouter();

  const [githubPending, startGithubTransition] = useTransition();
  const [emailPending, startEmailTransition] = useTransition();

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: { email: "" },
  });

  const handleSignInWithGithub = async () => {
    startGithubTransition(async () => {
      await authClient.signIn.social({
        provider: "github",
        callbackURL: "/",
        fetchOptions: {
          onSuccess: () => {
            toast.success("GitHub sign-in successful");
          },
          onError: () => {
            toast.error("GitHub sign-in failed");
          },
        },
      });
    });
  };

  const handleSignInWithEmail = async (email: string) => {
    startEmailTransition(async () => {
      await authClient.emailOtp.sendVerificationOtp({
        email: email,
        type: "sign-in",
        fetchOptions: {
          onSuccess: () => {
            toast.success("Email verification code sent");
            router.push(`/verify-request?email=${email}`);
          },
          onError: () => {
            toast.error("Email verification code failed");
          },
        },
      });
    });
  };

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    handleSignInWithEmail(values.email);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="max-w-92 m-auto h-fit w-full"
        noValidate
      >
        <div className="p-6">
          <div>
            <Link href="/" aria-label="go home">
              <Logo />
            </Link>
            <h1 className="mb-1 mt-4 text-xl font-semibold">
              Sign In to Skillex
            </h1>
            <p>Welcome back! Sign in to continue</p>
          </div>

          <div className="mt-6">
            <Button
              type="button"
              variant="outline"
              className="w-full"
              disabled={githubPending || emailPending}
              onClick={handleSignInWithGithub}
            >
              {githubPending ? (
                <Loader2Icon className="animate-spin" />
              ) : (
                <GithubIcon />
              )}
              <span>Sign in with Github</span>
            </Button>
          </div>

          <div className="my-6 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
            <hr className="border-dashed" />
            <span className="text-muted-foreground text-xs">
              Or continue With
            </span>
            <hr className="border-dashed" />
          </div>

          <div className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      autoComplete="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full"
              disabled={emailPending || githubPending}
            >
              {emailPending ? (
                <Loader2Icon className="animate-spin" />
              ) : (
                <Send />
              )}
              Continue with Email
            </Button>
          </div>
        </div>

        <p className="text-accent-foreground text-center text-sm">
          Don&apos;t have an account ?
          <Button asChild variant="link" className="px-2">
            <Link href="#">Create account</Link>
          </Button>
        </p>
      </form>
    </Form>
  );
};

export default LoginPage;
