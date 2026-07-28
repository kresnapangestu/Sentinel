import type { Metadata } from "next";
import { AuthTemplate } from "@/components/templates/AuthTemplate";
import { MarketingPanel, LoginForm } from "@/features/auth";
import { Typography } from "@/components/atoms/Typography";

export const metadata: Metadata = {
  title: "Sign in | Sentinel",
  description: "Sign in to your Sentinel account.",
};

export default function LoginPage() {
  return (
    <AuthTemplate marketingSlot={<MarketingPanel />}>
      <header className="mb-6 flex flex-col gap-2">
        <Typography variant="h1">Welcome Back!</Typography>
        <Typography variant="bodySmall" as="p">
          Sign in to your account
        </Typography>
      </header>
      <LoginForm />
    </AuthTemplate>
  );
}
