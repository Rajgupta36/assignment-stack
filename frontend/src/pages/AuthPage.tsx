import { useLocation, useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn, signUp } from "@/lib/auth-client";
import { toast, Toaster } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function AuthPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const isSignup = location.pathname === "/signup";

  const signUpSchema = z
    .object({
      firstName: z.string().min(1, "First name is required"),
      lastName: z.string().min(1, "Last name is required"),
      email: z.string().email("Invalid email address"),
      password: z.string().min(6, "Password must be at least 6 characters"),
      confirmPassword: z.string().min(6, "Confirm your password"),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    });

  const signInSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
  });

  type SignUpFormValues = z.infer<typeof signUpSchema>;
  type SignInFormValues = z.infer<typeof signInSchema>;
  type FormValues = {
    firstName?: string;
    lastName?: string;
    email: string;
    password: string;
    confirmPassword?: string;
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(isSignup ? signUpSchema : signInSchema),
  });

  const onSubmit = async (data: SignUpFormValues | SignInFormValues) => {
    try {
      if (isSignup) {
        const response = await signUp.email({
          email: (data as SignUpFormValues).email,
          password: (data as SignUpFormValues).password,
          name: `${(data as SignUpFormValues).firstName} ${(data as SignUpFormValues).lastName}`,
        });

        if (response.data?.token) {
          toast.success("Signup successful!");
          navigate("/config");
        } else {
          const message = (response as any)?.error?.message|| "Signup failed. Please try again.";
          toast.error(message);
        }
      } else {
        const response = await signIn.email({
          email: (data as SignInFormValues).email,
          password: (data as SignInFormValues).password,
        });

        if (response.data?.token) {
          toast.success("Signin successful!");
          navigate("/config");
        } else {
          const message = (response as any)?.error?.message || "Signin failed. Check your credentials.";
          toast.error(message);
        }
      }
    } catch (err: any) {
      const message = err?.response?.data?.message ||  "Unexpected error";
      toast.error(message);
    }
  };

  return (
    <div className="h-screen w-screen overflow-x-hidden">
      <Toaster position="top-center" />
      <div className="min-h-screen flex flex-col lg:flex-row gap-4 sm:gap-8 lg:gap-10 xl:gap-12 px-4 sm:px-8 lg:px-12 xl:px-16 py-4 sm:py-8 lg:py-12 xl:py-16">
        <div className="hidden lg:flex lg:basis-[55%] xl:basis-[50%] bg-secondary rounded-3xl" />
        <div className="bg-background flex items-center justify-center flex-1 overflow-y-auto">
          <div className="w-full max-w-3xl space-y-4 sm:space-y-5 flex flex-col items-center justify-center py-2">
            <div className="text-center space-y-2 sm:space-y-3 flex gap-2 mb-4 sm:mb-6">
              <div className="flex mb-12">
                <img src="./logo-l.png" />
                <img src="./logo-r.png" />
                <img src="./logo-star.png" className="h-3 w-3 sm:h-4 sm:w-4 2xl:h-5 2xl:w-5" />
              </div>
              <h1 className="text-xl sm:text-2xl xl:text-3xl 2xl:text-4xl text-foreground">
                Stackguard
              </h1>
            </div>
            <div className="text-center space-y-2 mb-4 sm:mb-8">
              <h1 className="text-xl sm:text-3xl xl:text-4xl 2xl:text-4xl font-semibold text-foreground">
                {isSignup
                  ? "Welcome to Stackguard"
                  : "Welcome back to Stackguard"}
              </h1>
              <p className="text-sm sm:text-base xl:text-lg 2xl:text-xl leading-tight text-foreground text-center leading-relaxed px-1 sm:px-0">
                Secure your codebase with advanced secret scanning security best
                practices
              </p>
            </div>

            <div className="w-full">
              <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                {isSignup && (
                  <div className="w-full flex flex-col md:flex-row gap-3 sm:gap-4">
                    <div className="w-full md:w-1/2 flex flex-col">
                      <Input
                        className="w-full "
                        type="text"
                        placeholder="Enter First name"
                        disabled={isSubmitting}
                        {...register("firstName")}
                      />
                      {errors.firstName && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.firstName.message as string}
                        </p>
                      )}
                    </div>
                    <div className="w-full md:w-1/2 flex flex-col">
                      <Input
                        className="w-full "
                        type="text"
                        placeholder="Enter Last name"
                        disabled={isSubmitting}
                        {...register("lastName")}
                      />
                      {errors.lastName && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.lastName.message as string}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                <Input
                  className="w-full "
                  type="email"
                  placeholder="Enter email ID"
                  disabled={isSubmitting}
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">
                    {errors.email.message as string}
                  </p>
                )}

                <Input
                  className="w-full "
                  type="password"
                  placeholder="Enter Password"
                  disabled={isSubmitting}
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-red-500 text-sm">
                    {errors.password.message as string}
                  </p>
                )}

                {isSignup && (
                  <>
                    <Input
                      className="w-full "
                      type="password"
                      placeholder="Confirm password"
                      disabled={isSubmitting}
                      {...register("confirmPassword")}
                    />
                    {errors.confirmPassword && (
                      <p className="text-red-500 text-sm">
                        {errors.confirmPassword.message as string}
                      </p>
                    )}
                  </>
                )}

                <Button
                  type="submit"
                  className="w-full bg-primary hover:opacity-90 text-primary-foreground rounded-lg font-medium text-base"
                  disabled={isSubmitting}
                  aria-busy={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="inline-flex items-center justify-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {isSignup ? "Creating account..." : "Signing in..."}
                    </span>
                  ) : (
                    isSignup ? "Create account" : "Signin"
                  )}
                </Button>
              </form>
            </div>

            <p className="text-center text-xs sm:text-sm md:text-base">
              By continuing, you agree to our{" "}
              <Link to="/terms" className="underline font-medium  ">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link to="/privacy" className="underline font-medium">
                Privacy Policy
              </Link>
            </p>

            <p className="text-center mt-2 text-sm sm:text-base md:text-lg">
              {isSignup ? (
                <>
                  Already have an account?{" "}
                  <Link to="/signin" className=" underline font-medium">
                    Sign in
                  </Link>
                </>
              ) : (
                <>
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
