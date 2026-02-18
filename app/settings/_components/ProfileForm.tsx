"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateUserProfile } from "@/server/actions/user";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function ProfileForm({ initialName, initialEmail }: { initialName: string; initialEmail: string }) {
  const [state, setState] = useState({
    name: initialName,
    loading: false,
  });

  const updateState = (updates: Partial<typeof state>) =>
    setState((prev) => ({ ...prev, ...updates }));
  const router = useRouter();

  const handleSave = async () => {
    updateState({ loading: true });
    const result = await updateUserProfile({ name: state.name });
    updateState({ loading: false });

    if (result.success) {
      toast.success("Profile updated");
      router.refresh();
    } else {
      toast.error(result.error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input 
            id="name" 
            value={state.name} 
            onChange={(e) => updateState({ name: e.target.value })} 
            placeholder="Your Name" 
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" value={initialEmail} disabled className="bg-muted text-muted-foreground" />
      </div>

      <Button onClick={handleSave} disabled={state.loading}>
        {state.loading ? "Saving..." : "Save Profile"}
      </Button>
    </div>
  );
}
