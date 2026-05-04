import { SignIn } from "@clerk/nextjs";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <SignIn
      routing="path"
      path="/sign-in"
      signUpUrl="/sign-up"
      fallbackRedirectUrl="/dashboard"
      fallback={
        <p style={{ color: "var(--color-muted)", fontSize: 15 }}>Loading sign-in…</p>
      }
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
