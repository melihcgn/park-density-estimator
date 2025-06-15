import MapWrapper from "@/components/MapWrapper";

// ✅ Rename to avoid circular reference issue
export default function Home() {
  return (
    <div style={{ height: 'calc(100% - 3rem)' }}>
      <MapWrapper></MapWrapper>
    </div>
  );
}
