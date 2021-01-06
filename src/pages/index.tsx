import React, { useMemo, useState } from "react"
import GitHubOctocat from "../assets/GitHubOctocat.svg"
import LookupForm, { LookupData } from "../components/LookupForm"
import { servers } from "../config"
import Tabs from "../components/Tabs"
import ReverseForm, { ReverseData } from "../components/ReverseForm"
import Layout from "../components/Layout"
import SEO from "../components/seo"

function Index() {
  const [result, setResult] = useState<any>(null)
  const [mode, setMode] = useState("lookup")

  const handleSubmitLookup = useMemo(() => {
    return async (data: LookupData) => {
      try {
        const res = await fetch("/.netlify/functions/lookup", {
          method: "POST",
          body: JSON.stringify({
            servers: servers[data.server],
            hostname: data.hostname,
            type: data.type,
          }),
        })

        const json = await res.json()
        setResult(json)
      } catch (err) {
        setResult(err.message)
      }
    }
  }, [])

  const handleSubmitReverse = useMemo(() => {
    return async (data: ReverseData) => {
      try {
        const res = await fetch("/.netlify/functions/reverse", {
          method: "POST",
          body: JSON.stringify({ servers: servers[data.server], ip: data.ip }),
        })

        const json = await res.json()
        setResult(json)
      } catch (err) {
        setResult(err.message)
      }
    }
  }, [])

  return (
    <Layout>
      <SEO title="DNS Tool" />
      <h1>DNS Tool</h1>
      <p>DNS lookup and reverse IP lookup using public DNS servers.</p>
      <Tabs
        onChange={setMode}
        current={mode}
        items={[
          { value: "lookup", label: "Lookup" },
          { value: "reverse", label: "Reverse" },
        ]}
      />
      {mode === "lookup" && <LookupForm onSubmit={handleSubmitLookup} />}
      {mode === "reverse" && <ReverseForm onSubmit={handleSubmitReverse} />}
      <pre>
        {result
          ? JSON.stringify(result, null, 2)
          : "--- result will be displayed here"}
      </pre>
      <div className="Footer">
        <a href="https://github.com/smonn/dns-tool">
          <GitHubOctocat />
        </a>
      </div>
    </Layout>
  )
}

export default Index
