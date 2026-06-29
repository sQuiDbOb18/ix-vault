"use client";

import useSWR from "swr";
import type { Member } from "@/types";
import type { MemberInput } from "@/lib/validations";

async function fetcher(url: string) {
  const response = await fetch(url);
  if (!response.ok) throw new Error("Unable to load members");
  return (await response.json()) as Member[];
}

export function useMembers() {
  const swr = useSWR<Member[]>("/api/members", fetcher);
  const createMember = async (input: MemberInput) => {
    await swr.mutate(
      async (current) => {
        const response = await fetch("/api/members", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(input) });
        if (!response.ok) throw new Error((await response.json()).error ?? "Unable to add member");
        const member = (await response.json()) as Member;
        return current ? [member, ...current] : [member];
      },
      { rollbackOnError: true, revalidate: true }
    );
  };
  return { ...swr, members: swr.data ?? [], createMember };
}
