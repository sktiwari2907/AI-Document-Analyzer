import Summary from "@/components/Summary";

export default async function SummaryPage({
  searchParams,
}: {
  searchParams: Promise<{ data?: string }>;
}) {
  const params = await searchParams;
  let analysisData = null;

  if (params.data) {
    try {
      // Decode the JSON from the URL
      analysisData = JSON.parse(decodeURIComponent(params.data));
    } catch (e) {
      console.error("Failed to parse analysis data", e);
    }
  }

  return <Summary data={analysisData} />;
}