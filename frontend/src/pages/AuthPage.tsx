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
    formState: { errors },
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
        <div className="hidden lg:flex lg:m-8 xl:m-10 2xl:m-12 lg:basis-[55%] xl:basis-[50%] bg-secondary rounded-3xl"></div>
        <div className="bg-background flex  items-center justify-center px-4 py-6 sm:p-8">
          <div className="w-full max-w-3xl space-y-5 sm:space-y-6 flex flex-col items-center justify-center">
            <div className="text-center space-y-3 sm:space-y-4 flex gap-2 mb-10 sm:mb-12">
              <div className="flex">
                <img src="./logo-l.png" />
                <img src="./logo-r.png" />
                <img src="./logo-star.png" className="h-3 w-3 sm:h-4 sm:w-4 2xl:h-5 2xl:w-5" />
              </div>
              <h1 className="text-2xl sm:text-2xl xl:text-3xl 2xl:text-4xl text-foreground">
                Stackguard
              </h1>
            </div>
            <div className="text-center space-y-4 mb-10 sm:mb-16">
              <h1 className="text-2xl sm:text-3xl xl:text-4xl 2xl:text-4xl font-semibold text-foreground">
                {isSignup
                  ? "Welcome to Stackguard"
                  : "Welcome back to Stackguard"}
              </h1>
              <p className="text-sm sm:text-base xl:text-lg 2xl:text-xl text-foreground text-center leading-relaxed px-1 sm:px-0">
                Secure your codebase with advanced secret scanning security best
                practices
              </p>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              {isSignup && (
                <div className="w-full flex flex-col md:flex-row gap-3 sm:gap-4">
                  <Input
                    className="w-full md:w-1/2 h-12 md:h-14 lg:h-16"
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
                    className="w-full md:w-1/2 h-12 md:h-14 lg:h-16"
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
                className="w-full h-12 md:h-14 lg:h-16"
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
                className="w-full h-12 md:h-14 lg:h-16"
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
                    className="w-full h-12 md:h-14 lg:h-16"
                    type="password"
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
                className="mt-10 w-full bg-primary hover:opacity-90 text-primary-foreground h-12 md:h-14 lg:h-16 rounded-lg font-medium text-base sm:text-lg"
              >
                {isSignup ? "Create account" : "Signin"}
              </Button>
            </form>

            <p className="text-center text-xs sm:text-sm md:text-md mb-8">
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
