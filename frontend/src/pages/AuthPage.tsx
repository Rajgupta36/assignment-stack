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
      <div className="min-h-screen gap-24 flex flex-col lg:flex-row">
        <div className="m-12 hidden lg:flex basis-[55%] bg-secondary rounded-3xl"></div>
        <div className="bg-background flex  items-center justify-center  sm:p-8">
          <div className="max-w-xl space-y-6 flex flex-col items-center justify-center">
            <div className="text-center space-y-4 flex gap-2 mb-12">
              <div className="flex">
                <img src="./logo-l.png" />
                <img src="./logo-r.png" />
                <img src="./logo-star.png" className="h-4 w-4" />
              </div>
              <h1 className="text-9xl sm:text-3xl text-foreground">
                Stackguard
              </h1>
            </div>
            <div className="text-center space-y-4 mb-16">
              <h1 className="text-4xl sm:text-3xl font-semibold text-foreground">
                {isSignup
                  ? "Welcome to Stackguard"
                  : "Welcome back to Stackguard"}
              </h1>
              <p className="text-2xl sm:text-md text-foreground text-center leading-relaxed">
                Secure your codebase with advanced secret scanning security best
                practices
              </p>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              {isSignup && (
                <div className="w-3xl flex flex-row gap-4">
                  <Input
                    className="w-xl h-16"
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
                    className="w-xl h-16"
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
                className="w-3xl h-16"
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
                className="w-3xl h-16"
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
                    className="w-3xl h-16"
                    type="password "
                    placeholder="Confirm password"
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
                className="mt-12 w-3xl bg-primary hover:opacity-90 text-primary-foreground h-16 rounded-lg font-medium"
              >
                {isSignup ? "Create account" : "Signin"}
              </Button>
            </form>

            <p className="text-center text-md mb-8">
              By continuing, you agree to our{" "}
              <Link to="/terms" className="underline font-medium  ">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link to="/privacy" className="underline font-medium">
                Privacy Policy
              </Link>
            </p>

            <p className="text-center mt-2 text-lg">
              {isSignup ? (
                <>
                  Already have an account?{" "}
                  <Link to="/signin" className=" underline font-medium">
                    Sign in
                  </Link>
                </>
              ) : (
                <>
                  Don’t have an account?{" "}
                  <Link to="/signup" className=" underline font-medium">
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
