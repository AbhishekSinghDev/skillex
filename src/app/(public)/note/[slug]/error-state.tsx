import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

const ErrorState = ({ message }: { message: string }) => (
  <div className="max-w-4xl mx-auto p-6">
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-4">
      <AlertCircle className="h-16 w-16 text-destructive" />
      <h2 className="text-2xl font-semibold text-foreground">
        Oops! Something went wrong
      </h2>
      <p className="text-muted-foreground max-w-md">{message}</p>
      <Button
        onClick={() => window.location.reload()}
        variant="outline"
        className="mt-4"
      >
        Try Again
      </Button>
    </div>
  </div>
);

export default ErrorState;
