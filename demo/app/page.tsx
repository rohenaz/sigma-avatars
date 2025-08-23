'use client';

import { useState } from 'react';
import Avatar from '../../src/lib';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Copy, Check, Shuffle } from 'lucide-react';
import Link from 'next/link';
import colors from 'nice-color-palettes/1000';
import { CodeBlock } from '@/components/code-block';
import { useSidebar } from '@/components/ui/sidebar';
import { useSidebarContext } from '@/contexts/sidebar-context';

const paletteColors = colors;

export default function Home() {
  const { setOpen: setSidebarOpen } = useSidebar();
  const { handleAvatarClick } = useSidebarContext();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [currentPalette, setCurrentPalette] = useState(paletteColors[8]);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const randomizePalette = () => {
    const randomIndex = Math.floor(Math.random() * paletteColors.length);
    setCurrentPalette(paletteColors[randomIndex]);
  };

  const installCommand = 'npm install sigma-avatars';
  const basicUsage = `import Avatar from 'sigma-avatars';

<Avatar
  name="Maria Mitchell"
  variant="beam"
  colors={['#92A1C6', '#146A7C', '#F0AB3D', '#C271B4', '#C20D90']}
/>;`;

  const variants = ['marble', 'beam', 'pixel', 'sunset', 'ring', 'bauhaus', 'fractal', 'mage', 'barcode', 'pepe'];
  const demoNames = ['Mary Shelley', 'Ada Lovelace', 'Grace Hopper', 'Hedy Lamarr', 'Katherine Johnson'];
  
  // State for random avatar variants
  const [avatarVariants, setAvatarVariants] = useState(
    demoNames.map((_, i) => variants[i % variants.length])
  );

  const randomizeAvatars = () => {
    // Randomize both colors and variants
    randomizePalette();
    setAvatarVariants(
      demoNames.map(() => variants[Math.floor(Math.random() * variants.length)])
    );
  };

  const handleClick = (name: string, variant: string) => {
    const avatarData = {
      name,
      variant,
      colors: currentPalette,
      size: 80,
      square: false,
      useApi: false
    };
    handleAvatarClick(avatarData);
    setSidebarOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6">
            Sigma Avatars
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Beautiful, tiny JavaScript library for generating unique SVG-based avatars from any username and color palette.
          </p>
          
          {/* Demo Grid */}
          <div className="flex justify-center gap-4 mb-12 flex-wrap">
            {demoNames.map((name, i) => (
              <div 
                key={name} 
                className="transition-transform hover:scale-110 cursor-pointer"
                onClick={() => handleClick(name, avatarVariants[i])}
              >
                <Avatar
                  name={name}
                  variant={avatarVariants[i] as any}
                  colors={currentPalette}
                  size={80}
                />
              </div>
            ))}
            <Button
              variant="outline"
              size="icon"
              className="w-20 h-20 rounded-full"
              onClick={randomizeAvatars}
            >
              <Shuffle className="h-6 w-6" />
            </Button>
          </div>

          {/* CTA Buttons */}
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/playground">
              <Button size="lg" className="gap-2">
                Try Playground
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/examples">
              <Button size="lg" variant="outline">
                View Examples
              </Button>
            </Link>
            <Link href="https://github.com/rohenaz/sigma-avatars">
              <Button size="lg" variant="outline">
                GitHub
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16 border-t">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Deterministic</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Same input always generates the same avatar. Perfect for consistent user representations.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Customizable</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  10 unique variants, custom color palettes, multiple sizes, and shape options.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Lightweight</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Tiny bundle size with zero dependencies beyond React. Optimized for performance.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Quick Start */}
      <section className="container mx-auto px-4 py-16 border-t">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-12">Quick Start</h2>
          
          <Card>
            <Tabs defaultValue="npm" className="w-full">
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle>Installation</CardTitle>
                <TabsList className="h-8 grid grid-cols-4">
                  <TabsTrigger value="npm" className="text-xs data-[state=active]:text-xs">npm</TabsTrigger>
                  <TabsTrigger value="yarn" className="text-xs data-[state=active]:text-xs">yarn</TabsTrigger>
                  <TabsTrigger value="pnpm" className="text-xs data-[state=active]:text-xs">pnpm</TabsTrigger>
                  <TabsTrigger value="bun" className="text-xs data-[state=active]:text-xs">bun</TabsTrigger>
                </TabsList>
              </CardHeader>
              <CardContent>
                <TabsContent value="npm" className="mt-0">
                  <CodeBlock
                    code="npm install sigma-avatars"
                    language="bash"
                  />
                </TabsContent>
                <TabsContent value="yarn" className="mt-0">
                  <CodeBlock
                    code="yarn add sigma-avatars"
                    language="bash"
                  />
                </TabsContent>
                <TabsContent value="pnpm" className="mt-0">
                  <CodeBlock
                    code="pnpm add sigma-avatars"
                    language="bash"
                  />
                </TabsContent>
                <TabsContent value="bun" className="mt-0">
                  <CodeBlock
                    code="bun add sigma-avatars"
                    language="bash"
                  />
                </TabsContent>
              </CardContent>
            </Tabs>
          </Card>

          {/* Basic Usage */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Basic Usage</CardTitle>
              <CardDescription>
                Import and use the Avatar component in your React application
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <CodeBlock
                  code={basicUsage}
                  language="tsx"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 z-10"
                  onClick={() => copyToClipboard(basicUsage, 'usage')}
                >
                  {copiedCode === 'usage' ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Variants Preview */}
      <section className="container mx-auto px-4 py-16 border-t">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">Available Variants</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {variants.map((variant) => (
              <div 
                key={variant} 
                className="text-center cursor-pointer transition-transform hover:scale-105"
                onClick={() => handleClick("Maria Garcia", variant)}
              >
                <div className="flex justify-center mb-3">
                  <Avatar
                    name="Maria Garcia"
                    variant={variant as any}
                    colors={currentPalette}
                    size={80}
                  />
                </div>
                <Badge variant="secondary" className="text-xs">
                  {variant}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 border-t text-center text-muted-foreground">
        <p>
          Built with ❤️ using React and TypeScript. 
          Inspired by <a href="https://boringavatars.com" className="underline">Boring Avatars</a>.
        </p>
      </footer>
    </div>
  );
}