'use client';

import { useState } from 'react';
import Avatar from '../../../src/lib';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardAction, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Copy, Check, RefreshCw, Users, MessageSquare, ShoppingBag, Mail, Wallet, Hash, MoreHorizontal, ThumbsUp, Share } from 'lucide-react';
import colors from 'nice-color-palettes/1000';
import { CodeBlock } from '@/components/code-block';

const paletteColors = colors;

// Named color palettes showcasing different color formats
const namedPalettes = {
  'Hex Colors': ['#0077be', '#00a8cc', '#40e0d0', '#5f9ea0', '#20b2aa'],
  'RGB Colors': ['rgb(255, 107, 53)', 'rgb(255, 142, 83)', 'rgb(255, 107, 107)', 'rgb(255, 127, 127)', 'rgb(255, 165, 0)'],
  'HSL Colors': ['hsl(120, 60%, 50%)', 'hsl(180, 70%, 60%)', 'hsl(160, 80%, 70%)', 'hsl(140, 75%, 65%)', 'hsl(100, 65%, 55%)'],
  'OKLCH Colors': ['oklch(0.7 0.15 180)', 'oklch(0.8 0.12 200)', 'oklch(0.6 0.18 160)', 'oklch(0.75 0.14 220)', 'oklch(0.65 0.16 140)'],
  'CSS Variables': ['var(--primary)', 'var(--secondary)', 'var(--accent)', 'var(--muted)', 'var(--card)'],
  'Mixed Formats': ['#6a4c93', 'rgb(142, 68, 173)', 'hsl(282, 39%, 60%)', 'oklch(0.65 0.15 300)', 'var(--primary)'],
  'Short Hex': ['#f0a', '#3c9', '#a7f', '#e84', '#59d'],
  'RGBA/HSLA': ['rgba(255, 0, 100, 0.8)', 'rgba(0, 255, 150, 0.9)', 'hsla(240, 100%, 70%, 0.85)', 'hsla(60, 80%, 60%, 0.75)', 'rgba(100, 200, 255, 0.95)'],
  'Theme Colors': ['var(--color-primary)', 'var(--color-secondary)', 'var(--color-accent)', 'var(--color-chart-1)', 'var(--color-chart-2)'],
  'Marble Pop': ['#92A1C6', '#146A7C', '#F0AB3D', '#C271B4', '#C20D90']
};

export default function ExamplesPage() {
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

  const examples = [
    {
      id: 'team',
      title: 'Team',
      icon: Users,
      description: 'Perfect for displaying team members in your about page or company directory',
      names: [
        'Sarah Johnson',
        'Michael Chen',
        'Emily Rodriguez',
        'David Kim',
        'Jessica Williams',
        'Robert Zhang',
        'Amanda Brown',
        'Christopher Lee',
        'Lisa Anderson',
        'Daniel Martinez',
        'Sophie Turner',
        'James Wilson'
      ],
      variant: 'beam',
      size: 64,
      code: `// Team member avatars
const TeamMember = ({ member }) => (
  <div className="flex items-center gap-3">
    <Avatar
      name={member.name}
      variant="beam"
      size={64}
    />
    <div>
      <h3>{member.name}</h3>
      <p>{member.role}</p>
    </div>
  </div>
);`
    },
    {
      id: 'comments',
      title: 'Comments',
      icon: MessageSquare,
      description: 'Ideal for blog comments, discussion threads, and forum posts',
      names: [
        'alex.thompson',
        'maria_garcia',
        'john.doe.2024',
        'tech_enthusiast',
        'creative_mind',
        'startup_founder',
        'web_developer',
        'ui_designer'
      ],
      variant: 'marble',
      size: 40,
      code: `// Comment avatars
const Comment = ({ comment }) => (
  <div className="comment">
    <Avatar
      name={comment.username}
      variant="marble"
      size={40}
    />
    <div className="comment-content">
      <span>{comment.username}</span>
      <p>{comment.text}</p>
    </div>
  </div>
);`
    },
    {
      id: 'reviews',
      title: 'Reviews',
      icon: ShoppingBag,
      description: 'Great for e-commerce product reviews and ratings',
      names: [
        'Verified Buyer',
        'Happy Customer',
        'Tech Reviewer',
        'First Time User',
        'Long Term User',
        'Premium Member',
        'Guest User',
        'Beta Tester'
      ],
      variant: 'pixel',
      size: 48,
      code: `// Review avatars
const ProductReview = ({ review }) => (
  <div className="review">
    <Avatar
      name={review.userId || 'Anonymous'}
      variant="pixel"
      size={48}
    />
    <div>
      <div className="rating">{review.rating} stars</div>
      <p>{review.comment}</p>
    </div>
  </div>
);`
    },
    {
      id: 'chat',
      title: 'Chat',
      icon: MessageSquare,
      description: 'Perfect for messaging apps and real-time chat interfaces',
      names: [
        'online_user_1',
        'online_user_2',
        'away_user',
        'busy_status',
        'mobile_user',
        'desktop_user'
      ],
      variant: 'ring',
      size: 32,
      code: `// Chat message avatars
const ChatMessage = ({ message }) => (
  <div className="message">
    <Avatar
      name={message.userId}
      variant="ring"
      size={32}
    />
    <div className="message-bubble">
      {message.text}
    </div>
  </div>
);`
    },
    {
      id: 'blockchain',
      title: 'Crypto',
      icon: Wallet,
      description: 'Perfect for crypto wallets, blockchain explorers, and transaction displays',
      names: [
        '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
        '12c6DSiU4Rq3P4ZxziKxzrL5LmMBrzjrJX',
        '1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2',
        '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb3',
        '0x5aAeb6053f3E94C9b9A09f33669435E7Ef1BeAed',
        '0xfB6916095ca1df60bB79Ce92cE3Ea74c37c5d359',
        'a1075db55d416d3ca199f55b6084e2115b9345e16c5cf302fc80e9d5fbf5d48d',
        '4fef5e4c8b4af55dd28da5b2b1b5e3e4c8b4af55dd28da5b2b1b5e3e4c8b4af5'
      ],
      variant: 'barcode',
      size: 60,
      code: `// Crypto address/txid avatars
const CryptoAddress = ({ address }) => (
  <div className="wallet">
    <Avatar
      name={address}
      variant="barcode"
      size={60}
    />
    <p className="truncate">{address}</p>
  </div>
);`
    },
    {
      id: 'usernames',
      title: 'Social',
      icon: Hash,
      description: 'Perfect for social media profiles and user mentions',
      names: [
        '@johndoe',
        '@janedoe',
        '@techblogger',
        '@designer',
        '@developer',
        '@photographer',
        '@artist',
        '@musician',
        '@gamer',
        '@streamer'
      ],
      variant: 'mage',
      size: 48,
      code: `// Social profile avatars
const UserProfile = ({ username }) => (
  <div className="profile">
    <Avatar
      name={username}
      variant="mage"
      size={48}
    />
    <a href={\`/user/\${username}\`}>
      {username}
    </a>
  </div>
);`
    },
    {
      id: 'gaming',
      title: 'Gaming',
      icon: Users,
      description: 'Great for gaming platforms and player profiles',
      names: [
        'ProGamer123',
        'NinjaWarrior',
        'PixelMaster',
        'DragonSlayer',
        'CyberPunk2077',
        'SpaceExplorer',
        'MysticMage',
        'ShadowHunter'
      ],
      variant: 'pepe',
      size: 56,
      code: `// Gaming profile avatars
const PlayerCard = ({ player }) => (
  <div className="player-card">
    <Avatar
      name={player.gamertag}
      variant="pepe"
      size={56}
    />
    <div>
      <p>{player.gamertag}</p>
      <p>Level {player.level}</p>
    </div>
  </div>
);`
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="container mx-auto px-4 py-12 border-b">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Examples
          </h1>
          <p className="text-xl text-muted-foreground">
            Real UI component blocks showcasing Sigma Avatars in practical applications
          </p>
        </div>
      </section>

      {/* UI Component Examples */}
      <section className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-2xl font-bold mb-8">UI Component Examples</h2>
          
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Social Media Feed */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Social Media Feed
                </CardTitle>
                <CardDescription>
                  Posts and interactions with user avatars
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Avatar
                      name="sarah.jones"
                      variant="beam"
                      colors={namedPalettes['Ocean Breeze']}
                      size={40}
                      className="rounded-full"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm">Sarah Jones</span>
                        <span className="text-muted-foreground text-xs">@sarah.jones</span>
                        <span className="text-muted-foreground text-xs">·</span>
                        <span className="text-muted-foreground text-xs">2h</span>
                      </div>
                      <p className="text-sm mt-1">Just shipped a new feature! The team did an amazing job 🎉</p>
                      <div className="flex items-center gap-4 mt-2">
                        <Button variant="ghost" size="sm" className="h-8 px-2 text-muted-foreground">
                          <ThumbsUp className="h-4 w-4 mr-1" />
                          12
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 px-2 text-muted-foreground">
                          <MessageSquare className="h-4 w-4 mr-1" />
                          3
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 px-2 text-muted-foreground">
                          <Share className="h-4 w-4 mr-1" />
                          Share
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-start gap-3">
                    <Avatar
                      name="mike.chen"
                      variant="marble"
                      colors={namedPalettes['Forest Deep']}
                      size={40}
                      className="rounded-full"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm">Mike Chen</span>
                        <span className="text-muted-foreground text-xs">@mike.chen</span>
                        <span className="text-muted-foreground text-xs">·</span>
                        <span className="text-muted-foreground text-xs">4h</span>
                      </div>
                      <p className="text-sm mt-1">Working on some exciting new designs. Can't wait to share them!</p>
                      <div className="flex items-center gap-4 mt-2">
                        <Button variant="ghost" size="sm" className="h-8 px-2 text-muted-foreground">
                          <ThumbsUp className="h-4 w-4 mr-1" />
                          8
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 px-2 text-muted-foreground">
                          <MessageSquare className="h-4 w-4 mr-1" />
                          2
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 px-2 text-muted-foreground">
                          <Share className="h-4 w-4 mr-1" />
                          Share
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Chat Interface */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Chat Interface
                </CardTitle>
                <CardDescription>
                  Team chat with online status
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar
                        name="alex.kim"
                        variant="ring"
                        colors={namedPalettes['Purple Dreams']}
                        size={32}
                        className="rounded-full"
                      />
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-background rounded-full"></div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">Alex Kim</span>
                        <span className="text-xs text-muted-foreground">10:30 AM</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Online</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar
                        name="emma.wilson"
                        variant="sunset"
                        colors={namedPalettes['Warm Earth']}
                        size={32}
                        className="rounded-full"
                      />
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-yellow-500 border-2 border-background rounded-full"></div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">Emma Wilson</span>
                        <span className="text-xs text-muted-foreground">9:45 AM</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Away</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar
                        name="david.garcia"
                        variant="bauhaus"
                        colors={namedPalettes['Electric Blue']}
                        size={32}
                        className="rounded-full"
                      />
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-gray-400 border-2 border-background rounded-full"></div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">David Garcia</span>
                        <span className="text-xs text-muted-foreground">Yesterday</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Offline</p>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <Avatar
                      name="alex.kim"
                      variant="ring"
                      colors={namedPalettes['Purple Dreams']}
                      size={24}
                      className="rounded-full"
                    />
                    <div className="bg-muted rounded-lg px-3 py-2 max-w-xs">
                      <p className="text-sm">Hey team! Ready for the standup?</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2 justify-end">
                    <div className="bg-primary text-primary-foreground rounded-lg px-3 py-2 max-w-xs">
                      <p className="text-sm">Yes, starting in 5 minutes!</p>
                    </div>
                    <Avatar
                      name="current.user"
                      variant="beam"
                      colors={namedPalettes['Ocean Breeze']}
                      size={24}
                      className="rounded-full"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Profile Cards */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Team Directory
                </CardTitle>
                <CardDescription>
                  Employee profiles with role information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="border rounded-lg p-4 text-center">
                    <Avatar
                      name="lisa.martinez"
                      variant="pixel"
                      colors={namedPalettes['Sunset Glow']}
                      size={48}
                      className="mx-auto mb-3 rounded-full"
                    />
                    <h4 className="font-medium text-sm">Lisa Martinez</h4>
                    <p className="text-xs text-muted-foreground">Product Manager</p>
                    <div className="flex justify-center mt-2">
                      <Badge variant="secondary" className="text-xs">Design</Badge>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4 text-center">
                    <Avatar
                      name="tom.anderson"
                      variant="fractal"
                      colors={namedPalettes['Cool Mint']}
                      size={48}
                      className="mx-auto mb-3 rounded-full"
                    />
                    <h4 className="font-medium text-sm">Tom Anderson</h4>
                    <p className="text-xs text-muted-foreground">Senior Developer</p>
                    <div className="flex justify-center mt-2">
                      <Badge variant="secondary" className="text-xs">Engineering</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Notification Center */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Notifications
                </CardTitle>
                <CardDescription>
                  Recent activity and updates
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <Avatar
                    name="system.notification"
                    variant="mage"
                    colors={namedPalettes['Rose Gold']}
                    size={32}
                  />
                  <div className="flex-1">
                    <p className="text-sm"><strong>Jennifer Liu</strong> liked your post</p>
                    <p className="text-xs text-muted-foreground">2 minutes ago</p>
                  </div>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex items-start gap-3">
                  <Avatar
                    name="carlos.rodriguez"
                    variant="barcode"
                    colors={namedPalettes['Autumn Spice']}
                    size={32}
                  />
                  <div className="flex-1">
                    <p className="text-sm"><strong>Carlos Rodriguez</strong> commented on your design</p>
                    <p className="text-xs text-muted-foreground">1 hour ago</p>
                  </div>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex items-start gap-3">
                  <Avatar
                    name="project.update"
                    variant="pepe"
                    colors={namedPalettes['Electric Blue']}
                    size={32}
                  />
                  <div className="flex-1">
                    <p className="text-sm"><strong>Project Alpha</strong> milestone completed</p>
                    <p className="text-xs text-muted-foreground">3 hours ago</p>
                  </div>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Color Format Examples */}
      <section className="container mx-auto px-4 py-12 border-t">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-2xl font-bold mb-8">Supported Color Formats</h2>
          <p className="text-muted-foreground mb-8 max-w-3xl">
            Sigma Avatars supports all modern CSS color formats: hex colors (3, 6, or 8 digits), RGB/RGBA, HSL/HSLA, OKLCH, and CSS custom properties for seamless design system integration.
          </p>
          
          <div className="grid gap-6 md:grid-cols-2">
            {Object.entries(namedPalettes).map(([name, colors], paletteIndex) => (
              <Card key={name}>
                <CardHeader>
                  <CardTitle className="text-lg">{name}</CardTitle>
                  <CardDescription>
                    {name === 'Hex Colors' ? 'Standard 6-digit hex format' :
                     name === 'RGB Colors' ? 'RGB functional notation' :
                     name === 'HSL Colors' ? 'Hue, saturation, lightness values' :
                     name === 'OKLCH Colors' ? 'Modern perceptual color space' :
                     name === 'CSS Variables' ? 'Theme-aware custom properties' :
                     name === 'Mixed Formats' ? 'Combination of all formats' :
                     name === 'Short Hex' ? '3-digit hex shorthand' :
                     name === 'RGBA/HSLA' ? 'Colors with alpha transparency' :
                     name === 'Theme Colors' ? 'Design system variables' :
                     `Classic color palette with ${colors.length} colors`}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-6">
                    <div className="flex flex-col gap-2 flex-1">
                      {colors.map((color, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <div 
                            className="w-10 h-10 rounded-md border shadow-sm flex-shrink-0"
                            style={{ backgroundColor: color }}
                          />
                          <span className="text-sm font-mono text-muted-foreground">
                            {color}
                          </span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex flex-col gap-2 justify-center">
                      <Avatar
                        name={`${name} User 1`}
                        variant={['beam', 'marble', 'pixel', 'sunset', 'ring'][paletteIndex % 5] as any}
                        colors={colors}
                        size={40}
                      />
                      <Avatar
                        name={`${name} User 2`}
                        variant={['bauhaus', 'fractal', 'mage', 'barcode', 'pepe'][paletteIndex % 5] as any}
                        colors={colors}
                        size={40}
                      />
                      <Avatar
                        name={`${name} User 3`}
                        variant={['marble', 'beam', 'sunset', 'pixel', 'ring'][(paletteIndex + 2) % 5] as any}
                        colors={colors}
                        size={40}
                      />
                    </div>
                  </div>
                  
                  <div className="relative">
                    <CodeBlock
                      code={`const ${name.toLowerCase().replace(/\s+/g, '')}Colors = ${JSON.stringify(colors, null, 2)};`}
                      language="javascript"
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Use Case Examples */}
      <section className="container mx-auto px-4 py-8 border-t">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-2xl font-bold mb-8">Use Case Examples</h2>
          <div className="flex justify-end mb-6">
            <Button 
              variant="outline" 
              size="sm"
              onClick={randomizePalette}
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Shuffle Colors
            </Button>
          </div>

          <Tabs defaultValue="team" className="w-full">
            <TabsList className="w-full flex-wrap h-auto p-1 gap-1">
              {examples.map((example) => {
                const Icon = example.icon;
                return (
                  <TabsTrigger 
                    key={example.id} 
                    value={example.id}
                    className="data-[state=active]:bg-background gap-2"
                  >
                    <Icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{example.title}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>

            {examples.map((example) => (
              <TabsContent key={example.id} value={example.id} className="mt-6">
                <div className="grid gap-6 lg:grid-cols-2">
                  {/* Preview Card */}
                  <Card>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="flex items-center gap-2">
                            <example.icon className="h-5 w-5" />
                            {example.title}
                          </CardTitle>
                          <CardDescription className="mt-1">{example.description}</CardDescription>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                          <Badge variant="secondary">variant: {example.variant}</Badge>
                          <Badge variant="secondary">size: {example.size}px</Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {example.names.map((name) => (
                          <div key={name} className="flex flex-col items-center gap-2">
                            <Avatar
                              name={name}
                              variant={example.variant as any}
                              colors={currentPalette}
                              size={example.size}
                            />
                            <span className="text-xs text-muted-foreground text-center truncate max-w-full">
                              {name.length > 20 ? name.substring(0, 20) + '...' : name}
                            </span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Code Card */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Implementation</CardTitle>
                      <CardDescription>
                        Example code for this use case
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <CodeBlock
                        code={example.code}
                        language="tsx"
                      />
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* Integration Examples */}
      <section className="container mx-auto px-4 py-12 border-t">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-2xl font-bold mb-8">Integration Examples</h2>
          
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>With User Profiles</CardTitle>
                <CardDescription>
                  Fallback avatar when profile picture is missing
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CodeBlock
                  code={`const UserAvatar = ({ user }) => {
  if (user.profilePicture) {
    return <img src={user.profilePicture} />;
  }
  
  return (
    <Avatar
      name={user.email || user.id}
      variant="beam"
      size={60}
    />
  );
};`}
                  language="tsx"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Multiple Color Formats</CardTitle>
                <CardDescription>
                  Mix hex, RGB, HSL, OKLCH, and CSS variables
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CodeBlock
                  code={`// All supported color formats
const mixedColors = [
  '#FF6B6B',              // Hex
  'rgb(76, 201, 196)',    // RGB
  'hsl(200, 70%, 55%)',   // HSL
  'oklch(0.7 0.15 180)',  // OKLCH
  'var(--primary)'        // CSS Variable
];

<Avatar
  name={user.name}
  colors={mixedColors}
  variant="marble"
/>`}
                  language="tsx"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Dynamic Sizing</CardTitle>
                <CardDescription>
                  Responsive avatars based on viewport
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CodeBlock
                  code={`const ResponsiveAvatar = ({ name }) => {
  const [size, setSize] = useState(60);
  
  useEffect(() => {
    const handleResize = () => {
      setSize(window.innerWidth < 640 ? 40 : 60);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return <Avatar name={name} size={size} />;
};`}
                  language="tsx"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>CSS Variables & Theming</CardTitle>
                <CardDescription>
                  Integrate with design systems and theme providers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CodeBlock
                  code={`// Use CSS variables for theme-aware colors and shapes
const themeColors = [
  'var(--primary)',        // Adapts to light/dark
  'var(--secondary)',      // Theme-aware
  'var(--accent)',         // Design system
  'var(--color-chart-1)',  // Custom properties
  'var(--color-chart-2)'
];

// Use shadcn/ui radius variables for consistent shapes
<Avatar
  name={user.name}
  colors={themeColors}
  variant="beam"
  className="rounded-[var(--radius)]"  // Uses your theme's radius
/>

// Or use predefined shadcn helpers
import { shadcnColors } from 'sigma-avatars';

<Avatar
  name={user.name}
  colors={shadcnColors}
  variant="marble"
  style={{ borderRadius: 'var(--radius)' }}  // Alternative approach
/>`}
                  language="tsx"
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Short Hex & Transparency</CardTitle>
                <CardDescription>
                  Support for 3-digit hex and alpha channels
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CodeBlock
                  code={`// Short hex colors (3-digit)
const shortHex = ['#f0a', '#3c9', '#a7f', '#e84'];

// RGBA with transparency
const withAlpha = [
  'rgba(255, 0, 100, 0.8)',
  'rgba(0, 255, 150, 0.9)', 
  'hsla(240, 100%, 70%, 0.85)',
  '#ff6b6b80'  // 8-digit hex with alpha
];

<Avatar
  name="demo"
  colors={shortHex}
  variant="pixel"
/>`}
                  language="tsx"
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}