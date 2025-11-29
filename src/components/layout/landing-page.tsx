import { useNavigate } from "@tanstack/react-router";
import { Logo } from "../ui/logo";
import { Button } from "../ui/button";
import { ArrowRight, Zap, Folder, Globe } from "lucide-react";
import { SEOHead } from "../seo/seo-head";

export const LandingPage = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate({ to: "/app" });
  };

  return (
    <>
      <SEOHead
        title="QuickRest - Your elegant API testing companion"
        description="Test and analyze your APIs with AI-powered insights and a beautiful, intuitive interface. Fast, powerful, and organized API testing tool."
        canonicalUrl={typeof window !== "undefined" ? window.location.href : ""}
      />
      <div className="min-h-screen bg-white dark:bg-zinc-950 flex flex-col items-center justify-center px-4 py-12">
        <div className="max-w-2xl w-full text-center space-y-8">
          <div className="flex flex-col items-center space-y-6">
            <div className="w-24 h-24 text-zinc-900 dark:text-zinc-100">
              <Logo />
            </div>
            <div className="space-y-2">
              <h1 className="text-5xl font-bold text-zinc-900 dark:text-zinc-100">
                QuickRest
              </h1>
              <p className="text-xl text-zinc-600 dark:text-zinc-400">
                A no-nonsense API testing tool for developers
              </p>
            </div>
            <p className="text-base text-zinc-500 dark:text-zinc-500 max-w-lg mx-auto">
              Fast, powerful, and straightforward. Built for developers who want
              to test APIs without the bloat.
            </p>
          </div>

          <div className="flex flex-col items-center space-y-4 pt-4">
            <Button
              variant="primary"
              size="lg"
              onClick={handleGetStarted}
              className="px-8 py-3 text-base font-medium"
            >
              Start Testing
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <button
              onClick={handleGetStarted}
              className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
            >
              Continue Working
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 mt-12 border-t border-zinc-200 dark:border-zinc-800">
            <div className="flex flex-col items-center space-y-2">
              <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Zap className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Fast & Powerful
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-500 text-center">
                Lightning-fast API testing with advanced features
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <div className="w-12 h-12 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <Folder className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Organized Collections
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-500 text-center">
                Organize requests with folders and smart search
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <Globe className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Environment Variables
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-500 text-center">
                Manage multiple environments seamlessly
              </p>
            </div>
          </div>

          <div className="pt-8 space-y-2">
            <a
              href="https://kreativekorna.com/blog/api-testing-with-quickrest"
              className="text-sm text-zinc-500 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
            >
              Learn more about API testing
            </a>
            <p className="text-xs text-zinc-400 dark:text-zinc-600">
              Created by{" "}
              <a
                href="https://kreativekorna.com"
                className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors font-medium"
              >
                KreativeKorna Concepts
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};
