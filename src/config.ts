import { Option } from "./components/Select"

export type ServerMap = {
  [key: string]: string[]
  Cloudflare: string[]
  Google: string[]
  Verisign: string[]
  "DNS.Watch": string[]
}

export const servers: ServerMap = {
  Cloudflare: ["1.1.1.1", "1.0.0.1"],
  Google: ["8.8.8.8", "8.8.4.4"],
  Verisign: ["64.6.64.6", "64.6.65.6"],
  "DNS.Watch": ["84.200.69.80", "84.200.70.40"],
}

export const typeOptions: Option[] = [
  { value: "A", text: "A - IPv4 addresses" },
  { value: "AAAA", text: "AAAA - IPv6 addresses" },
  { value: "CNAME", text: "CNAME - Canonical Name records" },
  { value: "MX", text: "MX - Mail Exchange records" },
  { value: "NAPTR", text: "NAPTR - Name Authority Pointer records" },
  { value: "NS", text: "NS - Name Server records" },
  { value: "PTR", text: "PTR - Pointer records" },
  { value: "SOA", text: "SOA - Start of Authority records" },
  { value: "SRV", text: "SRV - Service records" },
  { value: "TXT", text: "TXT - Text records" },
]

export const serverOptions: Option[] = Object.keys(servers).map((server) => ({
  value: server,
  text: `${server} - ${servers[server].join(", ")}`,
}))
