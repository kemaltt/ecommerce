import React from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";

type LoginForm = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const { register, handleSubmit } = useForm<LoginForm>();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [loading, setLoading] = React.useState(false);

  async function onSubmit(data: LoginForm) {
    // basic client-side validation (react-hook-form also prevents empty fields because of required)
    if (!data.email || !data.password) {
      toast({ title: "Eksik alan", description: "E-posta ve parola giriniz." });
      return;
    }

    setLoading(true);
    try {
      // TODO: replace with real API call when backend ready
      await new Promise((res) => setTimeout(res, 200));
      // toast({ title: "Giriş başarılı", description: "Yönlendiriliyorsunuz...", variant: "success" });
      setLocation("/");
    } catch {
      toast({ title: "Giriş başarısız", description: "Lütfen bilgilerinizi kontrol edin.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[url('/assets/eCommerce.jpg')] bg-cover bg-center">
      <div className="backdrop-blur-sm bg-white/70 dark:bg-slate-900/60 rounded-2xl shadow-xl max-w-lg w-full mx-4 p-8">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-sky-500 rounded-full flex items-center justify-center text-white font-bold">EC</div>
          <div>
            <h2 className="text-2xl font-semibold">Mağaza Yönetimi'ne Giriş</h2>
            <p className="text-sm text-muted-foreground">Hesabınıza giriş yapın ve yönetimi başlatın</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm">E-posta</label>
            <Input type="email" {...register("email", { required: true })} />
          </div>

          <div>
            <label className="block mb-1 text-sm">Parola</label>
            <Input type="password" {...register("password", { required: true })} />
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">Hesabınız yok mu? <Link href="/register" className="text-sm text-primary underline">Kayıt Ol</Link></div>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                </svg>
              ) : null}
              Giriş
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
