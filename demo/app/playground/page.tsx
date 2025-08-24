import { Playground } from "@/components/playground";
import { Suspense } from "react";

export default function PlaygroundPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Playground />
    </Suspense>
  );
}
