"use client";

import { Button } from "@/components/ui/button";

interface SignInButtonProps {
  onSignIn: () => void;
}

export function SignInButton({ onSignIn }: SignInButtonProps) {
  return (
    <Button onClick={onSignIn} className="bg-blue-600 hover:bg-blue-700">
      Googleでサインイン
    </Button>
  );
}
