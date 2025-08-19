import Avatar, { shadcnColors, shadcnColorPrefixColors, defaultColors } from '../lib';

export const ColorDemo = () => {
  return (
    <div style={{ display: 'flex', gap: '2rem', padding: '2rem', flexWrap: 'wrap' }}>
      <div>
        <h3>Default Colors (Hex)</h3>
        <Avatar name="Default User" colors={defaultColors} size={80} />
      </div>
      
      <div>
        <h3>shadcn CSS Variables</h3>
        <Avatar name="shadcn User" colors={shadcnColors} size={80} />
      </div>
      
      <div>
        <h3>shadcn with --color prefix</h3>
        <Avatar name="Color Prefix" colors={shadcnColorPrefixColors} size={80} />
      </div>
      
      <div>
        <h3>Mixed Color Formats</h3>
        <Avatar 
          name="Mixed User" 
          colors={[
            'var(--primary)',
            '#ff6b6b',
            'oklch(0.7 0.2 340)',
            'hsl(220 14% 96%)',
            'rgb(100 200 150)'
          ]} 
          size={80} 
        />
      </div>
      
      <div>
        <h3>CSS Variables with Smart Contrast</h3>
        <Avatar 
          name="Smart Contrast" 
          variant="beam"
          colors={[
            'var(--primary)',
            'var(--secondary)',
            'var(--accent)'
          ]} 
          size={80} 
        />
        <p style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>
          beam variant auto-maps to --primary-foreground
        </p>
      </div>
    </div>
  );
};