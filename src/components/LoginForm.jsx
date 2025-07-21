import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button.jsx";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input.jsx";
import { useNavigate } from "react-router-dom";
import { api } from "@/api";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const loginSchema = z.object({
  username: z.string().min(3, "Kullanıcı adı en az 3 karakter olmalı"),
  password: z.string().min(6, "Şifre en az 6 karakter olmalı"),
});

function LoginForm() {
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    try {
      const res = await api.post("/auth/login", data);
      console.log("Giriş başarılı:", res.data);
      localStorage.setItem("user", JSON.stringify(res.data));
      navigate("/dashboard");
    } catch (error) {
      console.error("Giriş hatası:", error);
      alert("Giriş başarısız");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card className="w-full min-w-[450px] max-h-[550px] px-8 py-20 shadow-xl">
        <CardHeader className="gap-4">
          <CardTitle>Hesabınıza Giriş Yapın</CardTitle>
          <CardDescription>
            Hesabınıza giriş yapmak için kullanıcı adınızı ve şifrenizi girin
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label>Kullanıcı Adı</Label>
              <Input
                id="username"
                type="text"
                placeholder="Kullanıcı Adı"
                {...register("username")}
              />
            </div>
            <div className="grid gap-2">
              <div className="flex justify-center">
                <Label htmlFor="password" className="text-center">
                  Şifre
                </Label>
              </div>
              <Input id="password" type="password" {...register("password")} />
            </div>
          </div>
          <a
            href="#"
            className="ml-auto inline-block text-sm underline-offset-4 hover:underline py-3"
          >
            Şifrenizi mi unuttunuz?
          </a>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button type="submit" className="w-full">
            Giriş Yap
          </Button>
          <Button
            type="button"
            className="w-full"
            onClick={() => navigate("/register")}
          >
            Kayıt Ol
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}

export default LoginForm;
