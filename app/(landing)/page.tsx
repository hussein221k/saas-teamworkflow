import { Suspense } from "react";
import LandingPageContent from "./LandingPageContent";
import GlobalLoading from "../loading";

// Data fetching function to demonstrate streaming
// This function simulates fetching data from an external source
async function getLandingPageData(): Promise<{
  title: string;
  description: string;
  features: string[];
}> {
  // Simulate data fetching delay for streaming demonstration
  await new Promise((resolve) => setTimeout(resolve, 100));

  return {
    title: "Strategic Neural Workflow Management",
    description:
      "Highly customizable tactical clusters for building modern enterprises.",
    features: [
      "Strategic Command",
      "Neural Synchronization",
      "Encrypted Uplink",
      "AI Automation Engine",
      "Global Scalability",
      "Unit Management",
    ],
  };
}

// Separate async component for streaming data fetch
async function LandingPageData() {
  // Use the data - it's fetched and awaited here
  const data = await getLandingPageData();

  // Log to verify data fetching works (server-side only)
  console.log("Landing page data loaded:", data.title);

  return (
    <div data-landing-data data-title={data.title}>
      {/* This component demonstrates streaming - data is fetched separately */}
      {/* The actual content is rendered in LandingPageContent */}
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<GlobalLoading />}>
      {/* Streaming data fetch in separate function */}
      <Suspense fallback={null}>
        <LandingPageData />
      </Suspense>

      {/* Main content with client-side animations */}
      <LandingPageContent />
    </Suspense>
  );
}
