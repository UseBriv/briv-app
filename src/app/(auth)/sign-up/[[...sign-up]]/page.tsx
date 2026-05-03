import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <SignUp
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
