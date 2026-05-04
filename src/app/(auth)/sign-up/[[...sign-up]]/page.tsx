import { SignUp } from "@clerk/nextjs";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <SignUp
      routing="path"
      path="/sign-up"
      signInUrl="/sign-in"
      fallbackRedirectUrl="/dashboard"
      appearance={{
        variables: {
          colorPrimary: "#0b0b0c",
          colorText: "#0b0b0c",
          colorBackground: "#fbf8f1",
          colorInputBackground: "#fbf8f1",
          borderRadius: "12px",
          fontFamily: "var(--font-sans)",
        },
      }}
    />
  );
}
