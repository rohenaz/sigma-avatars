import { describe, expect, test } from 'bun:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import Avatar from '../index';

// Helper to render component to string and parse as DOM
function renderAvatar(props: any) {
  const svg = renderToStaticMarkup(<Avatar {...props} />);
  return svg;
}

// Helper to extract attributes from SVG string
function parseSvgAttributes(svg: string) {
  const widthMatch = svg.match(/width="(\d+)"/);
  const heightMatch = svg.match(/height="(\d+)"/);
  const viewBoxMatch = svg.match(/viewBox="([^"]*)"/);
  
  return {
    width: widthMatch ? widthMatch[1] : null,
    height: heightMatch ? heightMatch[1] : null,
    viewBox: viewBoxMatch ? viewBoxMatch[1] : null,
  };
}

describe('Avatar Component Rendering', () => {
  test('should render default avatar', () => {
    const svg = renderAvatar({ name: 'Test User' });
    expect(svg).toContain('<svg');
    expect(svg).toContain('</svg>');
  });

  test('should render with correct size', () => {
    const svg = renderAvatar({ name: 'Test User', size: 100 });
    const attrs = parseSvgAttributes(svg);
    expect(attrs.width).toBe('100');
    expect(attrs.height).toBe('100');
    // Note: internal viewBox uses SIZE constant (80) regardless of size prop
    expect(attrs.viewBox).toBe('0 0 80 80');
  });

  test('should render square avatar with no border radius', () => {
    const svg = renderAvatar({ name: 'Test User', square: true });
    // Square avatars should not have rounded corners
    expect(svg).not.toContain('rx="200"');
  });

  test('should render round avatar with border radius', () => {
    const svg = renderAvatar({ name: 'Test User', square: false, size: 100 });
    // Round avatars use mask with circular shape
    expect(svg).toContain('mask');
  });

  test('should include title when specified', () => {
    const svg = renderAvatar({ name: 'Test User', title: true });
    expect(svg).toContain('<title>Test User</title>');
  });

  test('should not include title when not specified', () => {
    const svg = renderAvatar({ name: 'Test User', title: false });
    expect(svg).not.toContain('<title>');
  });
});

describe('Avatar Variants', () => {
  const variants = [
    'marble', 'beam', 'pixel', 'sunset', 'ring', 
    'bauhaus', 'fractal', 'mage', 'anime', 'pepe'
  ];

  test.each(variants)('should render %s variant', (variant) => {
    const svg = renderAvatar({ name: 'Test User', variant });
    expect(svg).toContain('<svg');
    expect(svg).toContain('</svg>');
    // Each variant should produce some content
    expect(svg.length).toBeGreaterThan(100);
  });

  test('different names should produce different outputs', () => {
    const svg1 = renderAvatar({ name: 'Alice', variant: 'marble' });
    const svg2 = renderAvatar({ name: 'Bob', variant: 'marble' });
    expect(svg1).not.toBe(svg2);
  });

  test('same name should produce identical outputs', () => {
    const svg1 = renderAvatar({ name: 'Alice', variant: 'marble' });
    const svg2 = renderAvatar({ name: 'Alice', variant: 'marble' });
    expect(svg1).toBe(svg2);
  });
});

describe('Color Handling', () => {
  test('should handle hex colors', () => {
    const colors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF'];
    const svg = renderAvatar({ name: 'Test', colors });
    expect(svg).toBeDefined();
    // Should contain at least one of the colors
    expect(
      colors.some(color => svg.includes(color))
    ).toBe(true);
  });

  test('should handle CSS variables', () => {
    const colors = [
      'var(--primary)',
      'var(--secondary)',
      'var(--accent)',
      'var(--muted)',
      'var(--card)'
    ];
    const svg = renderAvatar({ name: 'Test', colors });
    expect(svg).toBeDefined();
    // CSS variables should be preserved in output
    expect(svg).toContain('var(--');
  });

  test('should handle mixed color formats', () => {
    const colors = [
      '#FF0000',
      'var(--primary)',
      'rgb(0, 255, 0)',
      'hsl(240, 100%, 50%)',
      'oklch(0.7 0.2 340)'
    ];
    const svg = renderAvatar({ name: 'Test', colors });
    expect(svg).toBeDefined();
    // Should handle without errors
    expect(svg).toContain('<svg');
  });

  test('should use default colors when not provided', () => {
    const svg = renderAvatar({ name: 'Test' });
    expect(svg).toBeDefined();
    // Should contain at least one default color
    const hasDefaultColor = 
      svg.includes('#92A1C6') || 
      svg.includes('#146A7C') ||
      svg.includes('#F0AB3D') ||
      svg.includes('#C271B4') ||
      svg.includes('#C20D90');
    expect(hasDefaultColor).toBe(true);
  });
});

describe('Special Variants', () => {
  test('fractal variant should generate unique patterns for different names', () => {
    const svg1 = renderAvatar({ name: 'UnitedHealth Group', variant: 'fractal' });
    const svg2 = renderAvatar({ name: 'Mastercard', variant: 'fractal' });
    
    // These should be different (this was a bug that was fixed)
    expect(svg1).not.toBe(svg2);
    
    // Both should have path elements
    expect(svg1).toContain('<path');
    expect(svg2).toContain('<path');
  });

  test('mage variant should have black face background', () => {
    const svg = renderAvatar({ name: 'Wizard', variant: 'mage' });
    
    // Mage faces should always be black
    expect(svg).toContain('#000000');
  });

  test('pepe variant should render with sunglasses', () => {
    const svg = renderAvatar({ name: 'Pepe', variant: 'pepe' });
    
    // Should have complex paths for sunglasses
    expect(svg).toContain('<path');
    expect(svg.length).toBeGreaterThan(1000); // Pepe is complex
  });

  test('anime variant should have cel-shaded appearance', () => {
    const svg = renderAvatar({ name: 'Sakura', variant: 'anime' });
    
    // Anime variant uses radialGradient for cel-shading
    expect(svg).toContain('radialGradient');
  });
});

describe('Edge Cases', () => {
  test('should handle empty name', () => {
    const svg = renderAvatar({ name: '' });
    expect(svg).toContain('<svg');
    // Empty string should still generate consistent output
  });

  test('should handle very long names', () => {
    const longName = 'A'.repeat(1000);
    const svg = renderAvatar({ name: longName });
    expect(svg).toContain('<svg');
  });

  test('should handle special characters in names', () => {
    const specialNames = [
      'Alice & Bob',
      'user@example.com',
      '123-456-7890',
      'Ñoño José',
      '🚀 Rocket',
      '<script>alert("xss")</script>'
    ];

    specialNames.forEach(name => {
      const svg = renderAvatar({ name });
      expect(svg).toContain('<svg');
      // Should not contain unescaped script tags
      expect(svg).not.toContain('<script>');
    });
  });

  test('should handle invalid color arrays', () => {
    const svg1 = renderAvatar({ name: 'Test', colors: [] });
    expect(svg1).toContain('<svg');
    
    const svg2 = renderAvatar({ name: 'Test', colors: [''] });
    expect(svg2).toContain('<svg');
  });

  test('should handle size as string', () => {
    const svg = renderAvatar({ name: 'Test', size: '150' });
    const attrs = parseSvgAttributes(svg);
    expect(attrs.width).toBe('150');
  });
});