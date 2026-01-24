import { DashboardLayout } from "@/layout/DashboardLayout";

export default function WorkspaceLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <DashboardLayout>{children}</DashboardLayout>
    );
}
