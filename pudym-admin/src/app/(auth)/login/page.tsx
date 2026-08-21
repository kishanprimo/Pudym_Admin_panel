import LoginPage from "@/screens/Authentication/LoginPage";
import AuthGuard from "@/components/auth/AuthGuard";

export default function Page() {
  return (
    <AuthGuard>
      <LoginPage />
    </AuthGuard>
  );
}