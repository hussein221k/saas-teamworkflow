"use client";

import { createEmployee } from "@/server/actions/employee";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function CreateEmployeeForm() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());

        const result = await createEmployee({
            name: data.name as string,
            username: data.username as string,
            employeeCode: data.employeeCode as string,
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
        <form onSubmit={handleSubmit} className="space-y-4 max-w-md bg-card p-6 rounded-xl border shadow-sm">
            <h2 className="text-xl font-bold mb-4">Create Employee Account</h2>
            <div>
                <Label htmlFor="name">Full Name</Label>
                <Input name="name" id="name" required placeholder="John Doe" />
            </div>
            <div>
                <Label htmlFor="username">Username (Unique)</Label>
                <Input name="username" id="username" required placeholder="johndoe" />
            </div>
            <div>
                <Label htmlFor="employeeCode">Employee Code (Unique)</Label>
                <Input name="employeeCode" id="employeeCode" required placeholder="EMP-001" />
            </div>
            <div>
                <Label htmlFor="password">Password</Label>
                <Input name="password" id="password" type="password" required />
            </div>
            <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Creating..." : "Create Employee"}
            </Button>
        </form>
    );
}
