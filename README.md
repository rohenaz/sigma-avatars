# Sigma Avatars

Sigma Avatars is a tiny JavaScript React library that generates custom, SVG-based avatars from any username and color palette.
<a href="https://www.npmjs.com/package/sigma-avatars">

![hi](https://badgen.net/npm/v/sigma-avatars)

</a>

## Install

```
bun add sigma-avatars
```

or with npm:

```
npm install sigma-avatars
```

## Usage

```jsx
import Avatar from 'sigma-avatars';

<Avatar name="Maria Mitchell" />;
```

### Props

| Prop    | Type                                                         | Default                                                   |
|---------|--------------------------------------------------------------|-----------------------------------------------------------|
| size    | number or string                                             | `40px`                                                    |
| square  | boolean                                                      | `false`                                                   |
| title   | boolean                                                      | `false`                                                   |
| name    | string                                                       | `Clara Barton`                                            |
| variant | oneOf: `marble`, `beam`, `pixel`,`sunset`, `ring`, `bauhaus` | `marble`                                                  |
| colors  | array                                                        | `['#92A1C6', '#146A7C', '#F0AB3D', '#C271B4', '#C20D90']` | 


#### Name
The `name` prop is used to generate the avatar. It can be the username, email or any random string.

```jsx
<Avatar name="Maria Mitchell"/>
```

#### Variant
The `variant` prop is used to change the theme of the avatar. The available variants are: `marble`, `beam`, `pixel`, `sunset`, `ring` and `bauhaus`.

```jsx
<Avatar name="Alice Paul" variant="beam"/>
```

#### Size
The `size` prop is used to change the size of the avatar.

```jsx
<Avatar name="Ada Lovelace" size={88}/>
```

#### Colors
The `colors` prop is used to change the color palette of the avatar. Sigma Avatars now supports CSS variables and modern color formats including those used by shadcn/ui.

```jsx
// Traditional hex colors
<Avatar name="Grace Hopper" colors={["#fb6900", "#f63700", "#004853", "#007e80", "#00b9bd"]}/>

// shadcn/ui CSS variables (OKLCH)
<Avatar name="Jane Doe" colors={[
  "var(--color-primary)",
  "var(--color-secondary)", 
  "var(--color-accent)",
  "var(--color-muted)",
  "var(--color-card)"
]}/>

// Mix of formats
<Avatar name="John Smith" colors={[
  "var(--primary)",
  "#f63700",
  "oklch(0.7 0.2 340)",
  "hsl(220 14% 96%)",
  "rgb(100 200 150)"
]}/>
```

#### Square
The `square` prop is used to make the avatar square.

```jsx
<Avatar name="Helen Keller" square/>
```

## API service

> [!IMPORTANT]  
> Please note that the old service was paused in July 31st 2024. We recommend transitioning to our new API service to ensure uninterrupted access and support.

Get access to the Sigma Avatars API service [here →](https://boringdesigners.gumroad.com/l/sigma-avatars-service).
