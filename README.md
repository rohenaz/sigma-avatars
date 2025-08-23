# Sigma Avatars

Sigma Avatars is a tiny JavaScript React library that generates custom, SVG-based avatars from any username and color palette.

<a href="https://www.npmjs.com/package/sigma-avatars">

![npm version](https://badgen.net/npm/v/sigma-avatars)

</a>

## 🚀 Demo

Try the interactive playground: [https://avatars.sigmaidentity.com/playground](https://avatars.sigmaidentity.com/playground)

## Install

```bash
bun add sigma-avatars
```

or with npm:

```bash
npm install sigma-avatars
```

## Quick Start

```jsx
import Avatar from 'sigma-avatars';

<Avatar name="Maria Mitchell" />
```

## ✨ Features

- **10 Unique Variants**: Choose from marble, beam, pixel, sunset, ring, bauhaus, fractal, mage, barcode, and pepe
- **Deterministic**: Same input always generates the same avatar
- **Customizable**: Support for custom colors, sizes, and shapes
- **Modern Color Support**: CSS variables, OKLCH, HSL, RGB, and shadcn/ui integration
- **Shape Options**: Circle (default), rounded square, or square
- **API Integration**: Built-in support for server-side avatar generation
- **TypeScript**: Full TypeScript support with type definitions
- **Tiny Bundle**: Minimal size impact on your application
- **Zero Dependencies**: No external dependencies beyond React

## API Reference

### Props

| Prop      | Type                                                         | Default                                                   | Description |
|-----------|--------------------------------------------------------------|-----------------------------------------------------------|-------------|
| name      | string                                                       | `'Clara Barton'`                                         | Username, email, or any string for avatar generation |
| variant   | `'marble'` \| `'beam'` \| `'pixel'` \| `'sunset'` \| `'ring'` \| `'bauhaus'` \| `'fractal'` \| `'mage'` \| `'barcode'` \| `'pepe'` | `'marble'`                                                | Avatar style variant |
| size      | number                                                       | `80`                                                      | Avatar size in pixels |
| colors    | string[]                                                     | `['#92A1C6', '#146A7C', '#F0AB3D', '#C271B4', '#C20D90']` | Color palette array |
| className | string                                                       | `'rounded-md'`                                           | CSS classes for shape (`rounded-full`, `rounded-md`, `rounded-none`) |
| title     | boolean                                                      | `false`                                                   | Include accessible title element |
| api       | string                                                       | `undefined`                                               | API endpoint for server-side generation |

### Basic Usage

```jsx
import Avatar from 'sigma-avatars';

// Basic avatar
<Avatar name="Maria Mitchell" />

// Custom size and variant
<Avatar name="Grace Hopper" variant="beam" size={120} />

// Different shapes
<Avatar name="Ada Lovelace" className="rounded-full" />    // Circle
<Avatar name="Katherine Johnson" className="rounded-md" /> // Rounded (default)
<Avatar name="Dorothy Vaughan" className="rounded-none" /> // Square
```

### Variants

All available avatar variants:

```jsx
// Classic variants
<Avatar name="Alice" variant="marble" />   // Marble texture
<Avatar name="Bob" variant="beam" />       // Geometric beams
<Avatar name="Carol" variant="pixel" />    // Pixel art style
<Avatar name="David" variant="sunset" />   // Gradient sunset
<Avatar name="Eve" variant="ring" />       // Concentric rings
<Avatar name="Frank" variant="bauhaus" />  // Bauhaus design

// Special variants
<Avatar name="Grace" variant="fractal" />  // L-system fractals
<Avatar name="Henry" variant="mage" />     // Mystical appearance
<Avatar name="Iris" variant="barcode" />   // Vertical stripes
<Avatar name="Jack" variant="pepe" />      // Pepe with sunglasses
```

### Color Customization

Support for multiple color formats:

```jsx
// Traditional hex colors
<Avatar 
  name="Hedy Lamarr" 
  colors={["#fb6900", "#f63700", "#004853", "#007e80", "#00b9bd"]} 
/>

// CSS variables (great for theming)
<Avatar 
  name="Marie Curie" 
  colors={[
    "var(--primary)",
    "var(--secondary)", 
    "var(--accent)",
    "var(--muted)",
    "var(--card)"
  ]} 
/>

// Modern color formats
<Avatar 
  name="Rosalind Franklin" 
  colors={[
    "oklch(0.7 0.2 340)",
    "hsl(220 14% 96%)",
    "rgb(100 200 150)",
    "#f63700",
    "var(--primary)"
  ]} 
/>
```

### shadcn/ui Integration

Built-in support for shadcn/ui color systems:

```jsx
import Avatar, { shadcnColors, shadcnColorPrefixColors } from 'sigma-avatars';

// Standard shadcn variables (--primary, --secondary, etc)
<Avatar name="shadcn User" colors={shadcnColors} />

// With --color prefix (--color-primary, --color-secondary, etc)
<Avatar name="Prefix User" colors={shadcnColorPrefixColors} />
```

### Server-Side Generation

Use the `api` prop for server-side avatar generation:

```jsx
// Client-side SVG generation (default)
<Avatar name="Local User" variant="beam" />

// Server-side generation via API
<Avatar name="API User" variant="beam" api="/api/avatar" />
```

When using the `api` prop, the component renders an `<img>` element that fetches the avatar from your API endpoint with the appropriate query parameters.

### API Endpoint

Create an API endpoint that returns avatar images in multiple formats (SVG, PNG, WebP):

```
GET /api/avatar?name=Maria%20Mitchell&variant=beam&size=120&colors=264653,2a9d8f,e9c46a&format=png
```

Supported parameters:
- `name`: Avatar name/identifier
- `variant`: Avatar variant (defaults to `beam`)
- `size`: Size in pixels (defaults to `80`)
- `colors`: Comma-separated hex colors without `#`
- `format`: Output format (`svg`, `png`, `webp` - defaults to `svg`)

## 🎨 Examples

### Team Directory
```jsx
const team = [
  { name: "Sarah Johnson", role: "CEO" },
  { name: "Mike Chen", role: "CTO" },
  { name: "Lisa Rodriguez", role: "Designer" }
];

{team.map(member => (
  <div key={member.name} className="flex items-center gap-3">
    <Avatar 
      name={member.name} 
      variant="beam" 
      size={40} 
      className="rounded-full" 
    />
    <div>
      <p className="font-medium">{member.name}</p>
      <p className="text-sm text-gray-500">{member.role}</p>
    </div>
  </div>
))}
```

### Chat Interface
```jsx
<div className="flex items-start gap-3">
  <Avatar 
    name={message.sender} 
    variant="marble" 
    size={32} 
    className="rounded-full" 
  />
  <div className="bg-gray-100 rounded-lg p-3">
    <p className="text-sm font-medium">{message.sender}</p>
    <p>{message.content}</p>
  </div>
</div>
```

### E-commerce Reviews
```jsx
<div className="flex items-center gap-2 mb-2">
  <Avatar 
    name={review.author} 
    variant="pixel" 
    size={24} 
    className="rounded-full" 
  />
  <span className="font-medium">{review.author}</span>
  <div className="flex">
    {[...Array(review.rating)].map((_, i) => (
      <Star key={i} className="h-4 w-4 fill-yellow-400" />
    ))}
  </div>
</div>
```

## 🛠 Development

```bash
# Clone the repository
git clone https://github.com/rohenaz/sigma-avatars.git
cd sigma-avatars

# Install dependencies
bun install

# Build the library
bun run build

# Run the demo
cd demo
bun install
bun dev
```

## 📄 License

MIT © [rohenaz](https://github.com/rohenaz)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

