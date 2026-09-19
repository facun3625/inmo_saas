import { DemoShell } from "@/components/demo/demo-site";
export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return <DemoShell>{children}</DemoShell>;
}
