import { useState } from "react";
import { z } from "zod";
import { setConfigKey } from "@/lib/config";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const schema = z
  .string()
  .min(100, "Key must be at least 100 characters")
  .max(1000, "Key must be at most 1000 characters");

export default function ConfigPage() {
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const onSave = () => {
    const parsed = schema.safeParse(value.trim());
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message || "Invalid key");
      return;
    }
    setError(null);
    setConfigKey(parsed.data);
    navigate("/dashboard", { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-2xl space-y-6">
        <h1 className="text-3xl font-semibold text-center">Configuration</h1>
        <p className="text-center text-sm text-muted-foreground">
          Paste your configuration key (100-1000 characters)
        </p>
        <Input
          className="w-full h-14"
          placeholder="Enter configuration key"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <Button onClick={onSave} className="w-full h-12">
          Save and continue
        </Button>
      </div>
    </div>
  );
}

