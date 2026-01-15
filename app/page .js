"use client";
import { useState } from "react";

export default function Home() {
  const [psid, setPsid] = useState("");
  const [result, setResult] = useState(null);

  const fetchMarks = async () => {
    const res = await fetch(`/api/fetch?psid=${psid}`);
    const data = await res.json();
    setResult(data);
  };

  return (
    <main style={{ padding: 20 }}>
      <h2>Fetch Student Marks</h2>

      <input
        placeholder="Enter PSID"
        value={psid}
        onChange={(e) => setPsid(e.target.value)}
      />

      <button onClick={fetchMarks}>Fetch</button>

      {result && (
        <pre>{JSON.stringify(result, null, 2)}</pre>
      )}
    </main>
  );
}
