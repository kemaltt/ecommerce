import React from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

type RegisterForm = {
  name: string;
  email: string;
  password: string;
};

export default function RegisterPage() {
  const { register, handleSubmit } = useForm<RegisterForm>();

  function onSubmit(data: RegisterForm) {
    // TODO: call /api/auth/register
    console.log("register submit", data);
  }

  return (
  <div className="min-h-screen w-full flex items-center justify-center bg-[url('/assets/eCommerce.jpg')] bg-cover bg-center">
      <div className="backdrop-blur-sm bg-white/70 dark:bg-slate-900/60 rounded-2xl shadow-xl max-w-lg w-full mx-4 p-8">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-rose-400 to-pink-600 rounded-full flex items-center justify-center text-white font-bold">EC</div>
          <div>
            <h2 className="text-2xl font-semibold">Yeni Hesap Oluştur</h2>
            <p className="text-sm text-muted-foreground">Hesabınızı oluşturun ve mağazanızı yönetin</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm">İsim</label>
            <Input {...register("name", { required: true })} />
          </div>

          <div>
            <label className="block mb-1 text-sm">E-posta</label>
            <Input type="email" {...register("email", { required: true })} />
          </div>

          <div>
            <label className="block mb-1 text-sm">Parola</label>
            <Input type="password" {...register("password", { required: true })} />
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">Zaten bir hesabınız var mı? <Link href="/login" className="text-sm text-primary underline">Giriş Yap</Link></div>
            <Button type="submit">Kayıt Ol</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
