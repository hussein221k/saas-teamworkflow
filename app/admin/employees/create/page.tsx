"use client";

import { createEmployee } from "@/server/actions/employee";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Code from "@/lib/empcode";

export default function CreateEmployeeForm() {
  const [loading, setLoading] = useState(false);
  const [employeeCode, setEmployeeCode] = useState<string>("");
  const router = useRouter();

  // Generate employee code on component mount
  useEffect(() => {
    Code().then((code) => setEmployeeCode(code));
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    const code = employeeCode || (await Code());

    const result = await createEmployee({
      name: data.name as string,
      username: data.username as string,
      employee_code: code,
      password: data.password as string,
    });

    if (result.success) {
      toast.success("Employee created successfully!");
      router.refresh();
      (e.target as HTMLFormElement).reset();
    } else {
      toast.error(result.error || "Failed to create employee");
    }
    setLoading(false);
  };

  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center ">
      <form
        onSubmit={handleSubmit}
        className="space-y-4 max-w-md bg-card p-6 rounded-xl border shadow-sm w-[80%]"
      >
        <h2 className="text-xl font-bold mb-4">Create Employee Account</h2>
        <div>
          <Label htmlFor="name">Full Name</Label>
          <Input name="name" id="name" required placeholder="Emp Name" />
        </div>
        <div>
          <Label htmlFor="username">Username (Unique)</Label>
          <Input name="username" id="username" required placeholder="Username (unique)" />
        </div>
        <div>
          <Label htmlFor="employeeCode">Employee Code (Unique)</Label>
          <Input
            name="employeeCode"
            id="employeeCode"
            value={employeeCode}
            onChange={(e) => setEmployeeCode(e.target.value)}
            placeholder="Auto-generated"
          />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input name="password" id="password" type="password" required placeholder="Password Must More than 8 letters" min={8} />
        </div>
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Creating..." : "Create Employee"}
        </Button>
      </form>
    </div>
  );
}
