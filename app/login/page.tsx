"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, LockKeyhole } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);
  const [leaving, setLeaving] = useState(false);

  const submit = async () => {
    setError("");
    const result = await signIn("credentials", { username, password, redirect: false });
    if (result?.error) {
      setError("Command access denied. Check username and password.");
      setShake(true);
      window.setTimeout(() => setShake(false), 450);
      return;
    }
    setLeaving(true);
    window.setTimeout(() => router.push("/dashboard"), 220);
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className={`premium-card w-full max-w-md p-6 transition duration-200 ${shake ? "shake" : ""} ${leaving ? "opacity-0" : "opacity-100"}`}>
        <div className="mb-8 text-center">
          <LockKeyhole className="mx-auto mb-4 text-text-accent" size={36} />
          <h1 className="wordmark text-4xl"><span className="text-[var(--accent-cobalt)]">IX</span> VAULT</h1>
          <p className="mt-2 text-sm text-text-secondary">9₮H_LEGION Command Access</p>
        </div>
        <div className="space-y-4">
          <Input label="Username" value={username} onChange={(event) => setUsername(event.target.value)} error={error ? " " : undefined} />
          <label className="block space-y-2">
            <span className="text-xs font-medium uppercase tracking-[0.08em] text-text-secondary">Password</span>
            <span className="relative block">
              <input type={show ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") void submit(); }} className={`h-11 w-full rounded-md border bg-[var(--bg-input)] px-3 pr-11 text-sm text-text-primary ${error ? "border-[var(--status-overdue)]" : "border-[var(--border-subtle)]"}`} />
              <button type="button" aria-label="Toggle password visibility" onClick={() => setShow((value) => !value)} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary">{show ? <EyeOff size={17} /> : <Eye size={17} />}</button>
            </span>
          </label>
          {error && <p className="rounded-md border border-[var(--status-overdue-border)] bg-[var(--status-overdue-bg)] p-3 text-sm text-[var(--status-overdue)]">{error}</p>}
          <Button className="w-full" onClick={submit}>Enter Vault</Button>
        </div>
      </div>
    </main>
  );
}
