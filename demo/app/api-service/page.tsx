"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { CodeBlock } from "@/components/code-block";
import { fortune500Companies } from "@/lib/fortune500-data";

export default function ApiServicePage() {
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  // Get random company name as default
  const getRandomCompany = () =>
    fortune500Companies[Math.floor(Math.random() * fortune500Companies.length)];
  const [companyName, setCompanyName] = useState(getRandomCompany());

  const baseUrl =
    typeof window !== "undefined"
      ? `${window.location.protocol}//${window.location.host}`
      : "https://your-domain.com";

  const exampleUrl = `${baseUrl}/api/avatar?name=${encodeURIComponent(companyName)}&variant=beam&size=120&colors=264653,2a9d8f,e9c46a,f4a261,e76f51`;

  const copyToClipboard = (text: string, id: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
    }
    setCopiedUrl(id);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const parameters = [
    {
      name: "name",
      type: "string",
      required: false,
      default: "default",
      description:
        "The name used to generate a unique avatar. Can be any string - username, email, uuid, etc.",
    },
    {
      name: "variant",
      type: "string",
      required: false,
      default: "marble",
      description: "The avatar style variant",
      options: [
        "marble",
        "beam",
        "pixel",
        "sunset",
        "ring",
        "bauhaus",
        "fractal",
        "mage",
        "barcode",
        "pepe",
      ],
    },
    {
      name: "size",
      type: "number",
      required: false,
      default: "80",
      description: "Size of the avatar in pixels (width and height)",
    },
    {
      name: "colors",
      type: "string",
      required: false,
      default: "default palette",
      description:
        "Comma-separated list of hex colors (without #). Example: 264653,2a9d8f,e9c46a",
    },
    {
      name: "format",
      type: "string",
      required: false,
      default: "svg",
      description: "Output format for the avatar",
      options: ["svg", "png", "webp"],
    },
  ];

  const examples = [
    {
      title: "Basic Avatar",
      url: `${baseUrl}/api/avatar?name=${encodeURIComponent(companyName)}`,
      description: "Simple avatar with default settings",
    },
    {
      title: "Custom Size",
      url: `${baseUrl}/api/avatar?name=${encodeURIComponent(companyName)}&size=200`,
      description: "Avatar with custom size",
    },
    {
      title: "With Colors",
      url: `${baseUrl}/api/avatar?name=${encodeURIComponent(companyName)}&colors=ff6b6b,4ecdc4,45b7d1`,
      description: "Avatar with custom color palette",
    },
    {
      title: "Different Variant",
      url: `${baseUrl}/api/avatar?name=${encodeURIComponent(companyName)}&variant=pixel`,
      description: "Pixel art style avatar",
    },
    {
      title: "PNG Format",
      url: `${baseUrl}/api/avatar?name=${encodeURIComponent(companyName)}&format=png`,
      description: "Avatar in PNG format",
    },
  ];

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">API Service</h1>
          <p className="text-muted-foreground mt-2">
            Generate unique, deterministic avatars via our REST API
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Endpoint</CardTitle>
            <CardDescription>
              All avatars are generated through a single GET endpoint
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Badge variant="default">GET</Badge>
              <code className="flex-1 p-2 bg-muted rounded-md text-sm">
                {baseUrl}/api/avatar
              </code>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  copyToClipboard(`${baseUrl}/api/avatar`, "endpoint")
                }
              >
                {copiedUrl === "endpoint" ? "Copied!" : "Copy"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Parameters</CardTitle>
            <CardDescription>
              All parameters are optional. If not provided, defaults will be
              used.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {parameters.map((param) => (
                <div
                  key={param.name}
                  className="border-l-2 border-muted pl-4 space-y-2"
                >
                  <div className="flex items-center gap-2">
                    <code className="font-mono text-sm font-semibold">
                      {param.name}
                    </code>
                    <Badge variant="outline">{param.type}</Badge>
                    {param.required && (
                      <Badge variant="destructive">Required</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {param.description}
                  </p>
                  {param.options && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {param.options.map((option) => (
                        <Badge key={option} variant="secondary">
                          {option}
                        </Badge>
                      ))}
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Default: <code>{param.default}</code>
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Tabs defaultValue="0" className="w-full">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="companyName"
                      className="text-sm font-medium"
                    >
                      Company Name
                    </Label>
                    <Input
                      id="companyName"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-64"
                      placeholder="Enter company name"
                    />
                  </div>
                </div>
                <TabsList className="w-auto">
                  {examples.map((example, index) => (
                    <TabsTrigger
                      key={index}
                      value={index.toString()}
                      className="text-sm px-3"
                    >
                      {example.title}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
              {examples.map((example, index) => (
                <TabsContent
                  key={index}
                  value={index.toString()}
                  className="space-y-4"
                >
                  <div>
                    <h4 className="font-semibold mb-2">{example.title}</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      {example.description}
                    </p>
                  </div>

                  <div className="flex items-start gap-6 rounded-lg border p-4">
                    {/* Preview */}
                    <div className="flex-shrink-0">
                      <img
                        src={example.url}
                        alt={example.title}
                        width={80}
                        height={80}
                        className="rounded-lg border"
                      />
                    </div>

                    {/* Code blocks */}
                    <div className="flex-1 space-y-4">
                      {/* API URL */}
                      <div className="rounded-md border overflow-hidden">
                        <div className="flex items-center justify-between px-3 py-2 border-b bg-muted/40">
                          <span className="text-sm font-medium">API URL</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              copyToClipboard(example.url, `url-${index}`)
                            }
                          >
                            {copiedUrl === `url-${index}`
                              ? "Copied!"
                              : "Copy URL"}
                          </Button>
                        </div>
                        <div className="p-0">
                          <CodeBlock language="bash" code={example.url} />
                        </div>
                      </div>

                      {/* React usage */}
                      <div className="rounded-md border overflow-hidden">
                        <div className="flex items-center justify-between px-3 py-2 border-b bg-muted/40">
                          <span className="text-sm font-medium">
                            React Component
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const params = new URLSearchParams(
                                example.url.split("?")[1],
                              );
                              const name = params.get("name") || companyName;
                              const variant = params.get("variant") || "beam";
                              const reactCode = `<Avatar api="/api/avatar" name="${name}" variant="${variant}" />`;
                              copyToClipboard(reactCode, `react-${index}`);
                            }}
                          >
                            {copiedUrl === `react-${index}`
                              ? "Copied!"
                              : "Copy React"}
                          </Button>
                        </div>
                        <div className="p-0">
                          <CodeBlock
                            language="tsx"
                            code={(() => {
                              const params = new URLSearchParams(
                                example.url.split("?")[1],
                              );
                              const name = params.get("name") || companyName;
                              const variant = params.get("variant") || "beam";
                              return `<Avatar api="/api/avatar" name="${name}" variant="${variant}" />`;
                            })()}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Response</CardTitle>
            <CardDescription>
              The API returns an SVG image directly
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm mb-2">
                Content-Type: <code>image/svg+xml</code>
              </p>
              <p className="text-sm mb-2">
                Cache-Control: <code>public, max-age=31536000, immutable</code>
              </p>
            </div>
            <Separator />
            <div>
              <p className="text-sm font-semibold mb-2">Usage in HTML:</p>
              <CodeBlock
                code={`<img src="${baseUrl}/api/avatar?name=${encodeURIComponent(companyName)}" alt="Avatar" />`}
                language="html"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
