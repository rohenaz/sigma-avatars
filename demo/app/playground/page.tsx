import { Suspense } from "react";
import { Playground } from "@/components/playground";

export default function PlaygroundPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Playground />
    </Suspense>
  );
}
