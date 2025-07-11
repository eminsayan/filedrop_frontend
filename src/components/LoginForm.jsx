import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {Button} from "@/components/ui/button.jsx";
import {Label} from "@radix-ui/react-label";
import {Input} from "@/components/ui/input.jsx";

import { useNavigate } from "react-router-dom";

function LoginForm() {
  const navigate = useNavigate();
  return (
    <form>
      <Card className="w-full min-w-[450px] max-h-[550px] px-8 py-20 shadow-xl">
        <CardHeader className="gap-4">
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex justify-center">
                <Label htmlFor="password" className="text-center">Password</Label>
              </div>
              <Input id="password" type="password" required />
            </div>
          </div>
          <a
            href="#"
            className="ml-auto inline-block text-sm underline-offset-4 hover:underline py-3"
          >
            Forgot your password?
          </a>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button type="submit" className="w-full">
            Login
          </Button>
          <Button type="button" className="w-full" onClick={() => navigate("/register") }>
            Sign Up
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}

export default LoginForm;
