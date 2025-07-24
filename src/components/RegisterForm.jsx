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
import { toast } from "sonner";

const registerSchema = z.object({
  username: z.string().min(3, "Kullanıcı adı en az 3 karakter olmalı"),
  password: z.string().min(6, "Şifre en az 6 karakter olmalı"),
});

function RegisterForm() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data) => {
    try {
      const res = await api.post(
        "/auth/register",
        data
      );
      localStorage.setItem("user", JSON.stringify(res.data));
      toast.success("Kayıt Başarılı", {
        description: "Yönlendiriliyorsunuz.",
      });
      navigate("/user-uploads");
    } catch (error) {
        toast.error("Kayıt Başarısız", {
        description: error.response?.data?.message || "Bir hata oluştu.",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card className="w-full min-w-[450px] max-h-[550px] px-8 py-20 shadow-xl">
        <CardHeader className="gap-4">
          <CardTitle>Kaydolun</CardTitle>
          <CardDescription>
            Kaydolmak için kullanıcı adınızı ve şifrenizi girin
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
              {errors.username && (
                <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
              )}
            </div>
            <div className="grid gap-2">
              <div className="flex justify-center">
                <Label htmlFor="password" className="text-center">
                  Şifre
                </Label>
              </div>
              <Input id="password" type="password" {...register("password")} />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button type="submit" className="w-full">
            Kayıt Ol
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}

export default RegisterForm;
