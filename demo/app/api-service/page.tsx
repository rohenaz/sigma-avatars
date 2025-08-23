'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';
import { CodeBlock } from '@/components/code-block';

export default function ApiServicePage() {
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  
  const baseUrl = typeof window !== 'undefined' 
    ? `${window.location.protocol}//${window.location.host}`
    : 'https://your-domain.com';
    
  const exampleUrl = `${baseUrl}/api/avatar?name=Maria%20Mitchell&variant=beam&size=120&colors=264653,2a9d8f,e9c46a,f4a261,e76f51`;

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedUrl(id);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const parameters = [
    {
      name: 'name',
      type: 'string',
      required: false,
      default: 'default',
      description: 'The name used to generate a unique avatar. Can be any string - username, email, uuid, etc.',
    },
    {
      name: 'variant',
      type: 'string',
      required: false,
      default: 'marble',
      description: 'The avatar style variant',
      options: ['marble', 'beam', 'pixel', 'sunset', 'ring', 'bauhaus', 'fractal', 'mage', 'barcode', 'pepe'],
    },
    {
      name: 'size',
      type: 'number',
      required: false,
      default: '80',
      description: 'Size of the avatar in pixels (width and height)',
    },
    {
      name: 'colors',
      type: 'string',
      required: false,
      default: 'default palette',
      description: 'Comma-separated list of hex colors (without #). Example: 264653,2a9d8f,e9c46a',
    },
    {
      name: 'square',
      type: 'boolean',
      required: false,
      default: 'false',
      description: 'Whether to render a square avatar instead of circular',
    },
  ];

  const examples = [
    {
      title: 'Basic Avatar',
      url: `${baseUrl}/api/avatar?name=John%20Doe`,
      description: 'Simple avatar with default settings',
    },
    {
      title: 'Custom Size',
      url: `${baseUrl}/api/avatar?name=Jane%20Smith&size=200`,
      description: 'Avatar with custom size',
    },
    {
      title: 'With Colors',
      url: `${baseUrl}/api/avatar?name=Alice&colors=ff6b6b,4ecdc4,45b7d1`,
      description: 'Avatar with custom color palette',
    },
    {
      title: 'Square Variant',
      url: `${baseUrl}/api/avatar?name=Bob&variant=pixel&square=true`,
      description: 'Square pixel art avatar',
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
                onClick={() => copyToClipboard(`${baseUrl}/api/avatar`, 'endpoint')}
              >
                {copiedUrl === 'endpoint' ? 'Copied!' : 'Copy'}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Parameters</CardTitle>
            <CardDescription>
              All parameters are optional. If not provided, defaults will be used.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {parameters.map((param) => (
                <div key={param.name} className="border-l-2 border-muted pl-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <code className="font-mono text-sm font-semibold">{param.name}</code>
                    <Badge variant="outline">{param.type}</Badge>
                    {param.required && <Badge variant="destructive">Required</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground">{param.description}</p>
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
              <div className="flex justify-end mb-4">
                <TabsList className="w-auto">
                  {examples.map((example, index) => (
                    <TabsTrigger key={index} value={index.toString()} className="text-sm px-3">
                      {example.title}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
              {examples.map((example, index) => (
                <TabsContent key={index} value={index.toString()} className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">{example.title}</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      {example.description}
                    </p>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <img
                        src={example.url}
                        alt={example.title}
                        width={80}
                        height={80}
                        className="rounded-lg"
                      />
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <code className="flex-1 p-2 bg-muted rounded-md text-xs break-all">
                          {example.url}
                        </code>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(example.url, `example-${index}`)}
                        >
                          {copiedUrl === `example-${index}` ? 'Copied!' : 'Copy'}
                        </Button>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                        >
                          <a href={example.url} target="_blank" rel="noopener noreferrer">
                            Open in new tab
                          </a>
                        </Button>
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
              <p className="text-sm mb-2">Content-Type: <code>image/svg+xml</code></p>
              <p className="text-sm mb-2">Cache-Control: <code>public, max-age=31536000, immutable</code></p>
            </div>
            <Separator />
            <div>
              <p className="text-sm font-semibold mb-2">Usage in HTML:</p>
              <CodeBlock
                code={`<img src="${baseUrl}/api/avatar?name=userId" alt="Avatar" />`}
                language="html"
              />
            </div>
            <div>
              <p className="text-sm font-semibold mb-2">Usage in React/Next.js:</p>
              <CodeBlock
                code={`<Image 
  src="${baseUrl}/api/avatar?name=userId"
  alt="Avatar"
  width={80}
  height={80}
  unoptimized
/>`}
                language="tsx"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}