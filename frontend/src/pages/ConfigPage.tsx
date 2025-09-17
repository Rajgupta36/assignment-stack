import { useEffect, useState } from "react";
import { z } from "zod";
import { useConfigKey } from "@/lib/config";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";

const schema = z
  .string()
  .min(100, "Key must be at least 100 characters")
  .max(1000, "Key must be at most 1000 characters");

export default function ConfigPage() {
  const { key, setKey } = useConfigKey();
  const [value, setValue] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (key && !value) {
      setValue(key);
    }
  }, [key]);

  const onSave = () => {
    const parsed = schema.safeParse(value.trim());
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message || "Invalid key");
      return;
    }
    setError(null);
    setKey(parsed.data);
    navigate("/dashboard", { replace: true });
  };

  return (
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
            <h1 className="text-2xl sm:text-3xl xl:text-4xl 2xl:text-4xl font-semibold text-foreground">Verify your public key</h1>
              <p className="text-sm sm:text-base xl:text-lg 2xl:text-xl text-foreground text-center leading-relaxed px-1 sm:px-0">
              To get started provide your public key for verification
            </p>
          </div>

          <div className="w-full">
            <label className="sr-only" htmlFor="public-key">Public key</label>
            <div className="relative w-full">
              <Input
                id="public-key"
                className="w-full h-12 md:h-14 lg:h-16 pr-12"
                placeholder="Enter your public key"
                type={show ? "text" : "password"}
                value={value}
                onChange={(e) => setValue(e.target.value)}
              />
              <button
                type="button"
                aria-label={show ? "Hide key" : "Show key"}
                aria-pressed={show}
                onClick={() => setShow((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/70 hover:text-foreground transition-colors"
              >
                {show ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </div>

          <Button onClick={onSave}  className="mt-10 w-full bg-primary hover:opacity-90 text-primary-foreground h-12 md:h-14 lg:h-16 rounded-lg font-medium text-base sm:text-lg">
            Verify
          </Button>

          <p className="text-center mt-2 text-sm sm:text-base md:text-lg">
            Don’t have a public key? Contact your administrator
          </p>
        </div>
      </div>
    </div>
  );
}

