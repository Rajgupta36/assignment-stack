import { useLocation, useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn, signUp } from "@/lib/auth-client";
import { toast, Toaster } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormValues | SignInFormValues>({
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
          navigate("/dashboard");
        } else {
          toast.error("Signup failed. Please try again.");
        }
      } else {
        const response = await signIn.email({
          email: (data as SignInFormValues).email,
          password: (data as SignInFormValues).password,
        });

        if (response.data?.token) {
          toast.success("Signin successful!");
          navigate("/dashboard");
        } else {
          toast.error("Signin failed. Check your credentials.");
        }
      }
    } catch (err: any) {
      toast.error(err?.message || "Something went wrong");
    }
  };

  return (
    <>
      <Toaster position="top-center" />
      <div className="min-h-screen flex flex-col lg:flex-row">
        <div className="hidden lg:flex flex-1 bg-secondary rounded-r-2xl"></div>
        <div className="flex-1 bg-background flex items-center justify-center p-6 sm:p-8">
          <div className="w-full max-w-md space-y-6">
            <div className="text-center space-y-4">
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                {isSignup
                  ? "Welcome to Stackguard"
                  : "Welcome back to Stackguard"}
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground text-center leading-relaxed">
                Secure your codebase with advanced secret scanning security best
                practices
              </p>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              {isSignup && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    type="text"
                    placeholder="Enter First name"
                    {...register("firstName")}
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-sm">
                      {errors.firstName.message as string}
                    </p>
                  )}
                  <Input
                    type="text"
                    placeholder="Enter Last name"
                    {...register("lastName")}
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-sm">
                      {errors.lastName.message as string}
                    </p>
                  )}
                </div>
              )}

              <Input
                type="email"
                placeholder="Enter email ID"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-red-500 text-sm">
                  {errors.email.message as string}
                </p>
              )}

              <Input
                type="password"
                placeholder="Enter Password"
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
                    type="password"
                    placeholder="Enter Confirm password"
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
                className="w-full bg-primary hover:opacity-90 text-primary-foreground h-12 rounded-lg font-medium"
              >
                {isSignup ? "Create account" : "Sign in"}
              </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground">
              {isSignup ? (
                <>
                  Already have an account?{" "}
                  <Link
                    to="/signin"
                    className="text-foreground underline font-medium"
                  >
                    Sign in
                  </Link>
                </>
              ) : (
                <>
                  Don’t have an account?{" "}
                  <Link
                    to="/signup"
                    className="text-foreground underline font-medium"
                  >
                    Create one
                  </Link>
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
