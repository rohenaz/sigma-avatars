'use client';

import React, { useMemo, useRef, useState, memo, useEffect } from 'react';
import Avatar, { PATTERN_CATEGORIES, PATTERN_REGISTRY } from '../../src/lib';
import colors from 'nice-color-palettes/1000';
import Image from 'next/image';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Shuffle, Circle, Square, SquareIcon, Loader2, Building2 } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import { fetchCompanies } from '../lib/fortune500-data';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from '@/components/ui/select';
import { CodeBlock } from './code-block';
import { useRouter, useSearchParams } from 'next/navigation';
import { AppSidebar } from './app-sidebar';
import { useSidebar } from "@/components/ui/sidebar";
import { useSidebarContext } from '@/contexts/sidebar-context';

const paletteColors = colors;

const variants = [
  'marble',
  'beam',
  'pixel',
  'sunset',
  'ring',
  'bauhaus',
  'fractal',
  'mage',
  'barcode',
  'pepe'
] as const;

// Different color palettes for variety
const colorPalettes = [
  ['#92A1C6', '#146A7C', '#F0AB3D', '#C271B4', '#C20D90'],
  ['#f582ae', '#b8e994', '#ffd803', '#00cdac', '#8b5cf6'],
  ['#ffc6ff', '#bdb2ff', '#a0c4ff', '#9bf6ff', '#caffbf'],
  ['#f72585', '#b5179e', '#7209b7', '#560bad', '#480ca8'],
  ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7'],
  ['#6c5ce7', '#74b9ff', '#a29bfe', '#fd79a8', '#fdcb6e'],
  ['#2d3436', '#636e72', '#b2bec3', '#dfe6e9', '#fdcb6e'],
  ['#fab1a0', '#ff7675', '#fd79a8', '#fdcb6e', '#e17055'],
  ['#00b894', '#00cec9', '#0984e3', '#6c5ce7', '#b2bec3'],
  ['#ff9ff3', '#feca57', '#ff6b6b', '#48dbfb', '#00d2d3'],
];

type Variant = typeof variants[number];

interface AvatarWrapperProps {
  name: string;
  variant: string;
  colors?: string[];
  size?: number;
  shape?: 'circle' | 'square' | 'rounded';
  useApi?: boolean;
  onAvatarClick?: (avatarData: {
    name: string;
    variant: string;
    colors?: string[];
    size: number;
    shape: 'circle' | 'square' | 'rounded';
    useApi: boolean;
  }) => void;
}

const AvatarWrapper = memo(
  ({ name, variant, colors, size, shape = 'circle', useApi = false, onAvatarClick }: AvatarWrapperProps) => {
    const { selectedAvatar } = useSidebarContext();
    
    // Check if this avatar matches the currently selected one
    const isSelected = selectedAvatar && 
      selectedAvatar.name === name && 
      selectedAvatar.variant === variant;

    const handleClick = () => {
      if (onAvatarClick) {
        onAvatarClick({ name, variant, colors, size: size || 80, shape: shape || 'circle', useApi });
      }
    };

    const downloadAvatar = async () => {
      if (useApi) {
        // Download from API
        const params = new URLSearchParams({
          name,
          variant,
          size: size?.toString() || '80',
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
      } else {
        // Download from client-rendered SVG
        const svgNode = svgRef.current;
        if (!svgNode) return;

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new window.Image();

        canvas.width = size || 80;
        canvas.height = size || 80;

        const svgString = new XMLSerializer().serializeToString(svgNode);
        const svgBlob = new Blob([svgString], {
          type: 'image/svg+xml;charset=utf-8',
        });
        const url = URL.createObjectURL(svgBlob);

        img.onload = () => {
          ctx?.drawImage(img, 0, 0);
          URL.revokeObjectURL(url);

          canvas.toBlob((blob) => {
            if (!blob) return;
            const pngUrl = URL.createObjectURL(blob);
            const downloadLink = document.createElement('a');
            downloadLink.href = pngUrl;
            downloadLink.download = `${name}-${variant}.png`;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
            URL.revokeObjectURL(pngUrl);
          });
        };

        img.src = url;
      }
    };

    // Build API URL for server-side rendering
    const apiUrl = useMemo(() => {
      if (!useApi) return null;
      const params = new URLSearchParams({
        name,
        variant,
        size: size?.toString() || '80',
        title: 'false', // Don't include title in img tags
        // Pass colors without # like Boring Avatars API
        ...(colors && colors.length > 0 && { 
          colors: colors.map(c => c.replace(/^#/, '')).join(',')
        }),
      });
      // Don't add cache buster - we want to leverage browser and server caching
      return `/api/avatar?${params}`;
    }, [name, variant, size, colors, useApi]);

    return (
      <div
        className={`flex flex-col items-center gap-2 cursor-pointer transition-colors ${
          isSelected 
            ? 'bg-primary/10 rounded-lg' 
            : 'hover:bg-muted/50 rounded-lg'
        }`}
        onClick={handleClick}
      >
        <Avatar
          name={name}
          variant={variant}
          colors={colors}
          size={size}
          api={useApi ? '/api/avatar' : undefined}
          className={shape === 'square' ? 'rounded-none' : shape === 'rounded' ? 'rounded-md' : 'rounded-full'}
        />
        <span className="text-xs text-muted-foreground truncate max-w-[8rem]">
          {name}
        </span>
      </div>
    );
  }
);

AvatarWrapper.displayName = 'AvatarWrapper';

const exampleNames = [
  'Apple', 'Microsoft', 'Amazon', 'Google', 'Meta', 'Tesla', 'Nvidia', 'Netflix', 'Adobe', 'Intel',
  'AMD', 'Cisco', 'Oracle', 'Salesforce', 'PayPal', 'Uber', 'Zoom', 'Moderna', 'Pfizer', 'Merck',
  'Nike', 'Disney', 'Starbucks', 'McDonald\'s', 'Costco', 'Walmart', 'Target', 'Home Depot', 'Lowe\'s', 'CVS',
  'Ford', 'GM', 'Boeing', 'Coca-Cola', 'Pepsi', 'Visa', 'Mastercard', 'Goldman Sachs', 'Morgan Stanley', 'American Express',
  'IBM', 'Intuit', 'eBay', 'Qualcomm', 'Comcast', 'AT&T', 'Verizon', 'Dell', 'HP', 'Best Buy',
  'Lululemon', 'Chipotle', 'Domino\'s', 'Johnson & Johnson', 'Kroger', 'Walgreens', '3M', 'Airbnb', 'Stryker', 'Abbott',
  'Bristol Myers Squibb', 'Eli Lilly', 'AbbVie', 'Amgen', 'Gilead', 'Regeneron', 'Biogen', 'Vertex', 'Illumina', 'Danaher',
  'Thermo Fisher', 'Agilent', 'Waters', 'PerkinElmer', 'Mettler Toledo', 'Idexx', 'Intuitive Surgical', 'Edwards Lifesciences', 'Boston Scientific', 'Medtronic',
  'Zimmer Biomet', 'Baxter', 'Becton Dickinson', 'Cardinal Health', 'McKesson', 'Amerisource Bergen', 'Centene', 'Anthem', 'Humana', 'Cigna',
  'UnitedHealth', 'Aetna', 'Molina', 'WellCare', 'JPMorgan', 'Bank of America', 'Wells Fargo', 'Citigroup', 'US Bancorp', 'Truist',
  'PNC', 'Capital One', 'Charles Schwab', 'BlackRock', 'State Street', 'Northern Trust', 'Zions', 'Fifth Third', 'KeyCorp', 'Regions',
  'Comerica', 'Huntington', 'M&T Bank', 'Citizens Financial', 'Synchrony', 'Discover', 'Ally', 'LendingClub', 'Square', 'Stripe',
  'Fiserv', 'FIS', 'Global Payments', 'Paychex', 'Automatic Data Processing', 'Workday', 'ServiceNow', 'Snowflake', 'MongoDB', 'Datadog',
  'CrowdStrike', 'Okta', 'Zscaler', 'Palo Alto Networks', 'Fortinet', 'Check Point', 'Splunk', 'VMware', 'Citrix', 'Red Hat',
  'ANSYS', 'Cadence', 'Synopsys', 'Autodesk', 'PTC', 'Dassault Systemes', 'Unity', 'Roblox', 'Electronic Arts', 'Activision',
  'Take-Two', 'Zynga', 'Roku', 'Spotify', 'Match Group', 'IAC', 'Expedia', 'Booking Holdings', 'TripAdvisor', 'Marriott',
  'Hilton', 'Hyatt', 'Wynn Resorts', 'MGM Resorts', 'Las Vegas Sands', 'Penn National', 'DraftKings', 'FanDuel', 'Caesars', 'Boyd Gaming',
  'Royal Caribbean', 'Carnival', 'Norwegian Cruise', 'Delta', 'American Airlines', 'United Airlines', 'Southwest', 'JetBlue', 'Alaska Air', 'Spirit Airlines',
  'FedEx', 'UPS', 'XPO Logistics', 'CH Robinson', 'Expeditors', 'JB Hunt', 'Knight-Swift', 'Schneider', 'Landstar', 'Old Dominion',
  'Ryder', 'Penske', 'Enterprise', 'Avis', 'Hertz', 'CarMax', 'Carvana', 'Vroom', 'AutoNation', 'Lithia Motors',
  'Group 1 Automotive', 'Sonic Automotive', 'Penske Automotive', 'KAR Auction', 'Copart', 'IAA', 'LKQ', 'Genuine Parts', 'AutoZone', 'Advance Auto Parts',
  'O\'Reilly Automotive', 'NAPA', 'Pep Boys', 'Valvoline', 'Jiffy Lube', 'Midas', 'Goodyear', 'Michelin', 'Bridgestone', 'Continental',
  'Cooper Tire', 'Pirelli', 'Yokohama', 'Hankook', 'Kumho', 'Toyo', 'BFGoodrich', 'Falken', 'General Tire', 'Nitto',
  'Caterpillar', 'Deere', 'CNH Industrial', 'AGCO', 'Kubota', 'Mahindra', 'New Holland', 'Case IH', 'Massey Ferguson', 'Fendt',
  'Claas', 'Deutz-Fahr', 'Same', 'Lamborghini', 'Hurlimann', 'Steyr', 'McCormick', 'Landini', 'Valtra', 'Challenger',
  'Apache', 'Chevron', 'ExxonMobil', 'ConocoPhillips', 'Marathon Petroleum', 'Valero', 'Phillips 66', 'HollyFrontier', 'PBF Energy', 'Andeavor',
  'Tesoro', 'Western Refining', 'Alon USA', 'Delek US', 'Par Pacific', 'CVR Energy', 'Calumet', 'HEP', 'MPLX', 'Enterprise Products',
  'Energy Transfer', 'Kinder Morgan', 'TC Energy', 'Enbridge', 'Pembina', 'Inter Pipeline', 'Gibson Energy', 'Keyera', 'Veresen', 'TransCanada',
  'Spectra Energy', 'Williams', 'Oneok', 'Targa Resources', 'DCP Midstream', 'Plains All American', 'Magellan Midstream', 'Buckeye Partners', 'NuStar Energy', 'Genesis Energy',
  'PAA', 'Sunoco Logistics', 'Energy Transfer Equity', 'Regency Energy Partners', 'MarkWest Energy', 'Access Midstream', 'Copano Energy', 'Eagle Rock Energy', 'Linn Energy', 'Breitburn Energy',
  'SandRidge Energy', 'Chesapeake Energy', 'Southwestern Energy', 'Range Resources', 'Cabot Oil & Gas', 'Antero Resources', 'EQT Corporation', 'CNX Resources', 'Consol Energy', 'Alpha Natural Resources',
  'Arch Coal', 'Peabody Energy', 'Cloud Peak Energy', 'Alliance Resource Partners', 'CONSOL Coal Resources', 'Westmoreland Coal', 'Rhino Resource Partners', 'Natural Resource Partners', 'Alliance Holdings', 'ARLP',
  'Blackstone', 'KKR', 'Apollo', 'Carlyle', 'TPG', 'Warburg Pincus', 'Silver Lake', 'Vista Equity', 'General Atlantic', 'Insight Partners',
  'Accel', 'Greylock', 'Kleiner Perkins', 'Sequoia', 'Andreessen Horowitz', 'Benchmark', 'NEA', 'GV', 'Intel Capital', 'Qualcomm Ventures',
  'Samsung Ventures', 'Sony Ventures', 'Toyota Ventures', 'Honda Ventures', 'Ford Ventures', 'GM Ventures', 'Daimler Ventures', 'BMW Ventures', 'Volvo Ventures', 'Jaguar Land Rover',
  'Aston Martin', 'Ferrari', 'McLaren', 'Lamborghini', 'Bentley', 'Rolls-Royce', 'Maserati', 'Alfa Romeo', 'Lotus', 'Koenigsegg',
  'Pagani', 'Bugatti', 'Porsche', 'Mercedes', 'BMW', 'Audi', 'Volkswagen', 'Skoda', 'Seat', 'Cupra',
  'Lexus', 'Infiniti', 'Acura', 'Genesis', 'Cadillac', 'Lincoln', 'Buick', 'Chrysler', 'Dodge', 'Jeep',
  'Ram', 'Fiat', 'Peugeot', 'Citroen', 'DS', 'Opel', 'Vauxhall', 'Holden', 'HSV', 'FPV',
  'Saab', 'Volvo', 'Polestar', 'Geely', 'BYD', 'NIO', 'XPeng', 'Li Auto', 'Lucid', 'Rivian',
  'Fisker', 'Canoo', 'Lordstown', 'Nikola', 'Hyliion', 'Romeo Power', 'QuantumScape', 'Solid Power', 'Sila Nanotechnologies', 'StoreDot',
  'CATL', 'BYD Battery', 'LG Energy', 'Samsung SDI', 'SK Innovation', 'Panasonic', 'Tesla Energy', 'Northvolt', 'Freyr Battery', 'Ioneer',
  'Livent', 'Albemarle', 'SQM', 'Ganfeng Lithium', 'Tianqi Lithium', 'Orocobre', 'Galaxy Resources', 'Pilbara Minerals', 'Mineral Resources', 'IGO',
  'Chalice Mining', 'Patriot Battery Metals', 'Critical Elements', 'Rock Tech Lithium', 'American Lithium', 'Lithium Americas', 'Sigma Lithium', 'Standard Lithium', 'E3 Metals', 'Lake Resources',
  'Vulcan Energy', 'European Lithium', 'Infinity Lithium', 'Bacanora Lithium', 'Kodal Minerals', 'Premier African Minerals', 'Atlantic Lithium', 'Savannah Resources', 'Eureka Lithium', 'Green Technology Metals',
  'Arcadium Lithium', 'Lithium Chile', 'Millennial Lithium', 'Neo Lithium', 'Arena Minerals', 'Wealth Minerals', 'Latin Resources', 'Portofino Resources', 'Plateau Energy Metals', 'Power Metals',
  'Brunswick Exploration', 'Omineca Mining', 'Ophir Gold', 'Thesis Gold', 'Sitka Gold', 'Yukon Metals', 'White Gold', 'Klondike Gold', 'Golden Predator', 'Victoria Gold',
  'ATAC Resources', 'Alexco Resource', 'Hecla Mining', 'Coeur Mining', 'Pan American Silver', 'First Majestic', 'Fortuna Silver', 'Endeavour Silver', 'MAG Silver', 'Great Panther Mining',
];

function ColorSwatch({
  color,
  onChange,
}: {
  color: string;
  onChange: (c: string) => void;
}) {
  const [open, setOpen] = useState(false);
  
  const normalizeHex = (value: string) => {
    if (!value) return '#000000';
    if (value.startsWith('#')) return value.length === 7 ? value : value;
    return `#${value}`;
  };

  const sanitizeHex = (value: string) => {
    let v = value.trim();
    if (v[0] !== '#') v = `#${v}`;
    if (v.length > 7) v = v.slice(0, 7);
    return v;
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          aria-label="Color"
          className="h-6 w-6 rounded-md border shadow-sm hover:scale-110 transition-transform"
          style={{ backgroundColor: color }}
        />
      </PopoverTrigger>
      <PopoverContent
        align="start"
        side="bottom"
        className="w-auto p-2"
        sideOffset={8}
      >
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={normalizeHex(color)}
            onChange={(e) => onChange(e.target.value)}
            className="h-8 w-10 cursor-pointer border rounded"
          />
          <input
            type="text"
            value={normalizeHex(color)}
            onChange={(e) => onChange(sanitizeHex(e.target.value))}
            className="h-8 w-24 rounded border bg-background px-2 text-sm"
            spellCheck={false}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}

export const Playground = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setOpen: setSidebarOpen } = useSidebar();
  const { handleAvatarClick: contextHandleAvatarClick, selectedAvatar, setCurrentColors, setSelectedAvatar } = useSidebarContext();
  const [variant, setVariant] = useState<Variant | 'random'>('random');
  const [avatarSize, setAvatarSize] = useState<number>(80);
  const [shape, setShape] = useState<'circle' | 'square' | 'rounded'>('circle');
  const [useApi, setUseApi] = useState(false);
  const [loadedCount, setLoadedCount] = useState(0);
  
  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: '100px',
  });

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    isLoading,
    refetch,
  } = useInfiniteQuery({
    queryKey: ['companies'],
    queryFn: ({ pageParam = 0 }) => fetchCompanies(pageParam, 25),
    getNextPageParam: (lastPage) => {
      return lastPage.hasMore ? lastPage.currentPage + 1 : undefined;
    },
    initialPageParam: 0,
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  useEffect(() => {
    if (data) {
      const total = data.pages.reduce((acc, page) => acc + page.companies.length, 0);
      setLoadedCount(total);
    }
  }, [data]);

  const allCompanies = data?.pages.flatMap(page => page.companies) ?? [];
  const totalCompanies = data?.pages[0]?.totalCount ?? 500;
  const progress = (loadedCount / totalCompanies) * 100;

  const [dotColor0, setDotColor0] = useState<string>(paletteColors[8][0]);
  const [dotColor1, setDotColor1] = useState<string>(paletteColors[8][1]);
  const [dotColor2, setDotColor2] = useState<string>(paletteColors[8][2]);
  const [dotColor3, setDotColor3] = useState<string>(paletteColors[8][3]);
  const [dotColor4, setDotColor4] = useState<string>(paletteColors[8][4]);

  const dotColors = useMemo(() => [dotColor0, dotColor1, dotColor2, dotColor3, dotColor4], [dotColor0, dotColor1, dotColor2, dotColor3, dotColor4]);
  const setters = [setDotColor0, setDotColor1, setDotColor2, setDotColor3, setDotColor4];

  // Update current colors in sidebar context whenever dotColors change
  useEffect(() => {
    setCurrentColors(dotColors);
  }, [dotColors, setCurrentColors]);

  const handleRandomColors = () => {
    const randomPalette =
      paletteColors[Math.floor(Math.random() * paletteColors.length)];
    setDotColor0(randomPalette[0]);
    setDotColor1(randomPalette[1]);
    setDotColor2(randomPalette[2]);
    setDotColor3(randomPalette[3]);
    setDotColor4(randomPalette[4]);
  };

  // Handle URL params on mount
  useEffect(() => {
    const name = searchParams.get('name');
    const avatarVariant = searchParams.get('variant');
    const size = searchParams.get('size');
    const shapeParam = searchParams.get('shape');
    const api = searchParams.get('api');
    
    if (name) {
      const avatarData = {
        name,
        variant: avatarVariant && (variants.includes(avatarVariant as Variant) || avatarVariant === 'random') ? avatarVariant : variant,
        colors: dotColors,
        size: size ? parseInt(size) : avatarSize,
        shape: shapeParam === 'square' ? 'square' : shapeParam === 'rounded' ? 'rounded' : 'circle',
        useApi: api === 'true' ? true : useApi
      };
      contextHandleAvatarClick(avatarData);
      setSidebarOpen(true);
      
      // Update state to match URL
      if (avatarVariant && (variants.includes(avatarVariant as Variant) || avatarVariant === 'random')) {
        setVariant(avatarVariant as Variant | 'random');
      }
      if (size) setAvatarSize(parseInt(size));
      if (shapeParam === 'square') setShape('square');
      else if (shapeParam === 'rounded') setShape('rounded');
      if (api === 'true') setUseApi(true);
    }
  }, [searchParams]);

  // Update URL when selected avatar changes (from sidebar interactions)
  useEffect(() => {
    if (selectedAvatar) {
      updateUrl(selectedAvatar);
    }
  }, [selectedAvatar]);

  const handleAvatarClick = (avatarData: {
    name: string;
    variant: string;
    colors?: string[];
    size: number;
    shape: 'circle' | 'square' | 'rounded';
    useApi: boolean;
  }) => {
    contextHandleAvatarClick(avatarData);
    setSidebarOpen(true);
    updateUrl(avatarData);
  };

  const updateUrl = (avatarData: {
    name: string;
    variant: string;
    size: number;
    shape: 'circle' | 'square' | 'rounded';
    useApi: boolean;
  }) => {
    const params = new URLSearchParams();
    params.set('name', avatarData.name);
    params.set('variant', avatarData.variant);
    params.set('size', avatarData.size.toString());
    params.set('shape', avatarData.shape);
    params.set('api', avatarData.useApi.toString());
    
    const url = `/playground?${params.toString()}`;
    router.replace(url);
  };




  return (
    <TooltipProvider delayDuration={200}>
      {/* Main content */}
      <div className="flex flex-1 flex-col">
            {/* Slim toolbar */}
            <div className="sticky top-[var(--app-header-h,3.5rem)] z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="px-2 md:px-3 flex items-center gap-2 h-12">
            {/* Variants as main tabs with horizontal scroll if needed */}
            <div className="min-w-0 flex-1 overflow-hidden">
              <Tabs
                value={variant}
                onValueChange={(v) => {
                  const newVariant = v as Variant | 'random';
                  setVariant(newVariant);
                  // Update URL with new variant
                  const params = new URLSearchParams(searchParams.toString());
                  params.set('variant', newVariant);
                  router.push(`?${params.toString()}`, { scroll: false });
                }}
                className="w-full"
              >
                <ScrollArea className="w-full whitespace-nowrap">
                  <TabsList className="bg-muted/50 h-8 rounded-md px-1">
                    <TabsTrigger
                      key="random"
                      value="random"
                      className="h-7 px-2.5 text-xs capitalize data-[state=active]:bg-background"
                    >
                      random
                    </TabsTrigger>
                    {variants.map((v) => (
                      <TabsTrigger
                        key={v}
                        value={v}
                        className="h-7 px-2.5 text-xs capitalize data-[state=active]:bg-background"
                      >
                        {v}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  <ScrollBar orientation="horizontal" className="h-1" />
                </ScrollArea>
              </Tabs>
            </div>

            {/* Divider between tabs and controls */}
            <Separator orientation="vertical" className="mx-2 hidden md:block h-6" />

            {/* Controls cluster (right side) */}
            <div className="flex items-center gap-2">
              {/* Size */}
              <div className="hidden lg:block text-xs text-muted-foreground">Size</div>
              <ToggleGroup
                type="single"
                value={avatarSize.toString()}
                onValueChange={(v) => v && setAvatarSize(Number(v))}
                className="h-8"
              >
                <ToggleGroupItem value="40" className="text-xs h-7 px-2">
                  S
                </ToggleGroupItem>
                <ToggleGroupItem value="80" className="text-xs h-7 px-2">
                  M
                </ToggleGroupItem>
                <ToggleGroupItem value="120" className="text-xs h-7 px-2">
                  L
                </ToggleGroupItem>
              </ToggleGroup>

              <Separator orientation="vertical" className="hidden md:block h-6" />

              {/* Shape */}
              <ToggleGroup
                type="single"
                value={shape}
                onValueChange={(v) => {
                  const newShape = v as 'circle' | 'square' | 'rounded';
                  setShape(newShape);
                  // Update the selected avatar's shape if one is selected
                  if (selectedAvatar) {
                    const updatedAvatar = {
                      ...selectedAvatar,
                      shape: newShape
                    };
                    setSelectedAvatar(updatedAvatar);
                    updateUrl(updatedAvatar);
                  }
                }}
                className="h-8"
              >
                <Tooltip>
                  <TooltipTrigger asChild>
                    <ToggleGroupItem value="circle" aria-label="Circle" className="h-7 px-2">
                      <Circle className="size-3.5" />
                    </ToggleGroupItem>
                  </TooltipTrigger>
                  <TooltipContent sideOffset={6}>Circle</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <ToggleGroupItem value="rounded" aria-label="Rounded" className="h-7 px-2">
                      <Square className="size-3.5" />
                    </ToggleGroupItem>
                  </TooltipTrigger>
                  <TooltipContent sideOffset={6}>Rounded</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <ToggleGroupItem value="square" aria-label="Square" className="h-7 px-2">
                      <svg 
                        width="14" 
                        height="14" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                        className="size-3.5"
                      >
                        <rect x="3" y="3" width="18" height="18" />
                      </svg>
                    </ToggleGroupItem>
                  </TooltipTrigger>
                  <TooltipContent sideOffset={6}>Square</TooltipContent>
                </Tooltip>
              </ToggleGroup>

              <Separator orientation="vertical" className="hidden md:block h-6" />

              {/* Color palette (5 swatches) */}
              <div className="flex items-center gap-1.5">
                {dotColors.slice(0, 5).map((c, i) => (
                  <ColorSwatch
                    key={i}
                    color={c}
                    onChange={(next) => setters[i](next)}
                  />
                ))}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={handleRandomColors}
                      aria-label="Random palette"
                    >
                      <Shuffle className="size-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent sideOffset={6}>Random palette</TooltipContent>
                </Tooltip>
              </div>

              <Separator orientation="vertical" className="hidden md:block h-6" />

              {/* Server API toggle */}
              <div className="flex items-center gap-2">
                <Label htmlFor="server-api" className="text-xs text-muted-foreground hidden sm:block">
                  Server
                </Label>
                <Switch
                  id="server-api"
                  checked={useApi}
                  onCheckedChange={setUseApi}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Company Grid with infinite scroll */}
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Building2 className="h-8 w-8" />
              <h1 className="text-3xl font-bold">Fortune 500 Avatar Gallery</h1>
            </div>
            <p className="text-muted-foreground mb-4">
              Infinite scroll demonstration with {totalCompanies} companies
            </p>
            
            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  Loaded {loadedCount} of {totalCompanies} companies
                </span>
                <span className="font-medium">{Math.round(progress)}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {allCompanies.map((company, index) => {
              const variantIndex = index % variants.length;
              const displayVariant = variant === 'random' ? variants[variantIndex] : variant;
              const paletteIndex = Math.floor(index / 50) % colorPalettes.length;
              const avatarColors = variant === 'random' ? colorPalettes[paletteIndex] : dotColors;

              return (
                <Card 
                  key={`${company}-${index}`} 
                  className="group hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => handleAvatarClick({
                    name: company,
                    variant: displayVariant, // Use the actual variant, not 'random'
                    colors: avatarColors,
                    size: 120,
                    shape: shape,
                    useApi: useApi
                  })}
                >
                  <CardContent className="p-4">
                    <div className="flex flex-col items-center space-y-3">
                      <div className="relative">
                        <Avatar
                          name={company}
                          variant={displayVariant}
                          colors={avatarColors}
                          size={80}
                          className={shape === 'square' ? 'rounded-none' : shape === 'rounded' ? 'rounded-md' : 'rounded-full'}
                          api={useApi ? '/api/avatar' : undefined}
                        />
                        <Badge 
                          variant="secondary" 
                          className="absolute -bottom-2 -right-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          #{index + 1}
                        </Badge>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium line-clamp-2">
                          {company}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {displayVariant}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            {/* Loading Skeletons */}
            {(isLoading || isFetchingNextPage) && (
              <>
                {[...Array(12)].map((_, i) => (
                  <Card key={`skeleton-${i}`}>
                    <CardContent className="p-4">
                      <div className="flex flex-col items-center space-y-3">
                        <Skeleton className="h-20 w-20 rounded-full" />
                        <div className="space-y-2 w-full">
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-3 w-2/3 mx-auto" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </>
            )}
          </div>

          {/* Infinite Scroll Trigger */}
          <div ref={ref} className="h-20 flex items-center justify-center mt-8">
            {isFetchingNextPage && (
              <div className="flex items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span className="text-muted-foreground">Loading more companies...</span>
              </div>
            )}
            {!hasNextPage && allCompanies.length > 0 && (
              <div className="text-center">
                <Badge variant="outline" className="text-lg px-4 py-2">
                  All {totalCompanies} companies loaded!
                </Badge>
                <p className="text-sm text-muted-foreground mt-2">
                  You've reached the end of the Fortune 500
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default Playground;
