'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

interface SelectedAvatar {
  name: string;
  variant: string;
  colors?: string[];
  size: number;
  square: boolean;
  useApi: boolean;
}

interface SidebarContextType {
  selectedAvatar: SelectedAvatar | null;
  customName: string;
  copiedItem: string | null;
  currentColors: string[] | null;
  setSelectedAvatar: (avatar: SelectedAvatar | null) => void;
  setCustomName: (name: string) => void;
  setCopiedItem: (item: string | null) => void;
  setCurrentColors: (colors: string[]) => void;
  handleAvatarClick: (avatar: SelectedAvatar) => void;
  copyToClipboard: (text: string, id: string) => void;
  downloadSelectedAvatar: () => Promise<void>;
  handleNameChange: (newName: string) => void;
  handleVariantChange: (newVariant: string) => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarContextProvider({ children }: { children: React.ReactNode }) {
  const [selectedAvatar, setSelectedAvatar] = useState<SelectedAvatar | null>(null);
  const [customName, setCustomName] = useState('');
  const [copiedItem, setCopiedItem] = useState<string | null>(null);
  const [currentColors, setCurrentColors] = useState<string[] | null>(null);

  const handleAvatarClick = useCallback((avatar: SelectedAvatar) => {
    setSelectedAvatar(avatar);
    setCustomName(avatar.name);
  }, []);

  const copyToClipboard = useCallback((text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedItem(id);
    setTimeout(() => setCopiedItem(null), 2000);
  }, []);

  const downloadSelectedAvatar = useCallback(async () => {
    if (!selectedAvatar) return;

    const { name, variant, colors, size, square } = selectedAvatar;
    const params = new URLSearchParams({
      name,
      variant,
      size: size.toString(),
      square: square.toString(),
      ...(colors && colors.length > 0 && { 
        colors: colors.map(c => c.replace(/^#/, '')).join(',') 
      }),
    });
    const url = `/api/avatar?${params}`;
    const link = document.createElement('a');
    link.href = url;
    link.download = `${name}-${variant}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [selectedAvatar]);

  const handleNameChange = useCallback((newName: string) => {
    setCustomName(newName);
    if (selectedAvatar) {
      setSelectedAvatar({ ...selectedAvatar, name: newName });
    }
  }, [selectedAvatar]);

  const handleVariantChange = useCallback((newVariant: string) => {
    if (selectedAvatar) {
      setSelectedAvatar({ ...selectedAvatar, variant: newVariant });
    }
  }, [selectedAvatar]);

  const value: SidebarContextType = {
    selectedAvatar,
    customName,
    copiedItem,
    currentColors,
    setSelectedAvatar,
    setCustomName,
    setCopiedItem,
    setCurrentColors,
    handleAvatarClick,
    copyToClipboard,
    downloadSelectedAvatar,
    handleNameChange,
    handleVariantChange,
  };

  return (
    <SidebarContext.Provider value={value}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebarContext() {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error('useSidebarContext must be used within a SidebarContextProvider');
  }
  return context;
}