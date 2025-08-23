'use client';

import * as React from "react"
import { useState } from 'react';
import Image from 'next/image';
import Avatar from 'sigma-avatars';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Copy, Check, Download, FileImage } from 'lucide-react';
import { CodeBlock } from './code-block';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { useSidebarContext } from '@/contexts/sidebar-context';
import { colorPalettes } from '@/lib/color-palettes';

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {}

const variants: ('pixel' | 'bauhaus' | 'ring' | 'beam' | 'sunset' | 'marble' | 'fractal' | 'mage' | 'barcode' | 'pepe')[] = ['marble', 'beam', 'pixel', 'sunset', 'ring', 'bauhaus', 'fractal', 'mage', 'barcode', 'pepe'];

export function AppSidebar(props: AppSidebarProps) {
  const { 
    selectedAvatar, 
    customName, 
    currentColors,
    selectedFormat,
    setSelectedFormat,
    handleNameChange, 
    handleVariantChange,
    downloadSelectedAvatar,
    copySvgToClipboard,
    copyToClipboard, 
    copiedItem 
  } = useSidebarContext();
  const generateCodeSnippet = (avatarData: typeof selectedAvatar) => {
    if (!avatarData) return '';
    
      const { name, variant, colors, size, shape } = avatarData;
    const colorsProp = colors && colors.length > 0 
      ? `\n  colors={${JSON.stringify(colors)}}`
      : '';
    
    return `import Avatar from 'sigma-avatars';

<Avatar
  name="${name}"
  variant="${variant}"
  size={${size}}${colorsProp}
/>`;
  };

  const generateApiUrl = (avatarData: typeof selectedAvatar) => {
    if (!avatarData) return '';
    
    const { name, variant, colors, size, shape } = avatarData;
    const params = new URLSearchParams({
      name,
      variant,
      size: size.toString(),
      format: selectedFormat,
      ...(colors && colors.length > 0 && { 
        colors: colors.map(c => c.replace(/^#/, '')).join(',') 
      }),
    });
    
    return `${window.location.origin}/api/avatar?${params}`;
  };

  // Build API URL for server-side rendering - must be before early return
  const apiUrl = React.useMemo(() => {
    if (!selectedAvatar?.useApi) return null;
    const params = new URLSearchParams({
      name: selectedAvatar.name,
      variant: selectedAvatar.variant,
      size: selectedAvatar.size.toString(),
      title: 'false', // Don't include title in img tags
      format: selectedFormat,
      // Pass colors without # like Boring Avatars API
      ...(selectedAvatar.colors && selectedAvatar.colors.length > 0 && { 
        colors: selectedAvatar.colors.map(c => c.replace(/^#/, '')).join(',')
      }),
    });
    return `/api/avatar?${params}`;
  }, [selectedAvatar, selectedFormat]);

  if (!selectedAvatar) {
    return (
      <Sidebar {...props}>
        <SidebarContent className="p-4">
          <div className="flex items-center justify-center h-full text-muted-foreground">
            Click an avatar to view details
          </div>
        </SidebarContent>
        <SidebarRail />
      </Sidebar>
    );
  }

  return (
    <Sidebar {...props}>
      <SidebarHeader className="p-4 border-b">
        <h2 className="text-lg font-semibold">Avatar Details</h2>
        <p className="text-sm text-muted-foreground">
          {selectedAvatar.variant} variant
        </p>
      </SidebarHeader>
      
      <SidebarContent className="p-4 space-y-6">
        {/* Name Input */}
        <div className="grid gap-2">
          <Label htmlFor="avatar-name" className="text-sm font-medium">
            Name
          </Label>
          <Input
            id="avatar-name"
            value={customName}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="Enter any name..."
          />
        </div>
        
        {/* Avatar Preview */}
        <div className="flex justify-center">
          <div className="bg-muted rounded-lg p-6">
            {selectedAvatar.useApi && apiUrl ? (
              <Image
                src={apiUrl}
                alt={`${selectedAvatar.name} avatar`}
                width={120}
                height={120}
                className={selectedAvatar.shape === 'square' ? 'rounded-none' : selectedAvatar.shape === 'rounded' ? 'rounded-md' : 'rounded-full'}
              />
            ) : (
              <Avatar
                name={selectedAvatar.name}
                variant={selectedAvatar.variant}
                colors={currentColors || selectedAvatar.colors || colorPalettes[0]}
                size={120}
                className={selectedAvatar.shape === 'square' ? 'rounded-none' : selectedAvatar.shape === 'rounded' ? 'rounded-md' : 'rounded-full'}
              />
            )}
          </div>
        </div>

        {/* Variant Selector */}
        <div className="grid gap-3">
          <Label className="text-sm font-medium">Variants</Label>
          <div className="grid grid-cols-5 gap-2">
            {variants.map((variant) => (
              <button
                key={variant}
                onClick={() => handleVariantChange(variant)}
                className={`relative p-2 rounded-md border transition-all hover:border-primary ${
                  selectedAvatar.variant === variant 
                    ? 'border-primary ring-2 ring-primary/20 bg-primary/5' 
                    : 'border-border hover:bg-accent'
                }`}
                title={variant}
              >
                <Avatar
                  name={selectedAvatar.name}
                  variant={variant}
                  colors={currentColors || selectedAvatar.colors || colorPalettes[0]}
                  size={32}
                  className={selectedAvatar.shape === 'square' ? 'rounded-none' : selectedAvatar.shape === 'rounded' ? 'rounded-md' : 'rounded-full'}
                />
                {selectedAvatar.variant === variant && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* React Code */}
        <div className="grid gap-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">React Component</Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(generateCodeSnippet(selectedAvatar), 'react')}
            >
              {copiedItem === 'react' ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
          <CodeBlock
            code={generateCodeSnippet(selectedAvatar)}
            language="tsx"
          />
        </div>

        {/* API URL */}
        <div className="grid gap-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">API URL</Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(generateApiUrl(selectedAvatar), 'api')}
            >
              {copiedItem === 'api' ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
          <CodeBlock
            code={generateApiUrl(selectedAvatar)}
            language="text"
          />
        </div>

        {/* Format & Size Selector */}
        <div className="grid gap-2">
          <Label htmlFor="format-select" className="text-sm font-medium">
            Format & Size
          </Label>
          <Select value={selectedFormat} onValueChange={(value) => setSelectedFormat(value as 'svg' | 'png' | 'webp')}>
            <SelectTrigger id="format-select">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="svg">
                <div className="flex items-center justify-between w-full">
                  <span>SVG</span>
                  <span className="text-xs text-muted-foreground ml-2">~2-3 KB</span>
                </div>
              </SelectItem>
              <SelectItem value="png">
                <div className="flex items-center justify-between w-full">
                  <span>PNG</span>
                  <span className="text-xs text-muted-foreground ml-2">~8-12 KB</span>
                </div>
              </SelectItem>
              <SelectItem value="webp">
                <div className="flex items-center justify-between w-full">
                  <span>WebP</span>
                  <span className="text-xs text-muted-foreground ml-2">~4-6 KB</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </SidebarContent>
      
      <SidebarFooter className="p-4 border-t space-y-2">
        <div className="flex gap-2">
          <Button 
            onClick={downloadSelectedAvatar} 
            className="flex-1"
            size="lg"
          >
            <Download className="h-4 w-4 mr-2" />
            Download {selectedFormat.toUpperCase()}
          </Button>
          <Button
            onClick={copySvgToClipboard}
            size="lg"
            variant="outline"
            title="Copy SVG Code"
          >
            {copiedItem === 'svg' ? (
              <Check className="h-5 w-5" />
            ) : (
              <Copy className="h-5 w-5" />
            )}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground text-center">
          Copy button exports raw SVG code
        </p>
      </SidebarFooter>
      
      <SidebarRail />
    </Sidebar>
  );
}