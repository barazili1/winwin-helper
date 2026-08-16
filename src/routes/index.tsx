import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useState } from "react";

const App = lazy(() => import("../winwin/App"));

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SMART BET — Live Game Signal Assistant" },
      {
        name: "description",
        content:
          "SMART BET gives you live signals, safe cash-out points and confidence scores for Wild West Gold and Gems & Mines.",
      },
      { property: "og:title", content: "SMART BET — Live Game Signal Assistant" },
      {
        property: "og:description",
        content:
          "Live signals, safe cash-out points and confidence scores for your favourite games.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="fixed inset-0 bg-black" />;

  return (
    <Suspense fallback={<div className="fixed inset-0 bg-black" />}>
      <App />
    </Suspense>
  );
}
