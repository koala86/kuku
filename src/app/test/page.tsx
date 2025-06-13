import AuthGuard from "@/components/AuthGuard";
import QuestionCard from "@/components/QuestionCard";

export default function TestPage() {
  return (
    <AuthGuard>
      <QuestionCard />
    </AuthGuard>
  );
}
