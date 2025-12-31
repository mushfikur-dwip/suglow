import { ReactNode } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AccountSidebar from "./AccountSidebar";

interface AccountLayoutProps {
  children: ReactNode;
  title: string;
  breadcrumb: string;
}

const AccountLayout = ({ children, title, breadcrumb }: AccountLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-secondary/30">
      <Header />

      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="container-custom py-4">
          <nav className="text-sm text-muted-foreground">
            <Link to="/" className="hover:text-primary">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">{breadcrumb}</span>
          </nav>
        </div>

        <section className="container-custom py-6 pb-16">
          <div className="flex flex-col lg:flex-row gap-8">
            <AccountSidebar />

            <div className="flex-1">
              <div className="bg-background rounded-xl p-6">
                <h1 className="font-display text-xl font-semibold text-foreground mb-6 pb-4 border-b border-border">
                  {title}
                </h1>
                {children}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AccountLayout;
