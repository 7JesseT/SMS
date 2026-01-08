# Theme Implementation Guide

## 🎯 How the Gold & White Theme Works

### 1. CSS Variables (Root Level)
**File**: `src/index.css`

```css
:root {
  --color-gold: #D4AF37;
  --color-gold-dark: #B88F2A;
  --color-white: #FFFFFF;
  --color-text: #111111;
  --color-muted: #F7F6F4;
}
```

**Usage**: Any CSS class can reference these:
```css
.myButton {
  background: var(--color-gold);
  color: var(--color-white);
  border: 1px solid var(--color-gold-dark);
}
```

### 2. Material-UI Theme
**File**: `src/theme/muiTheme.js`

The centralized theme file exports `goldWhiteTheme` which is a `createTheme()` object containing:

- **Palette**: Primary (gold), Secondary (white), Text, Background colors
- **Typography**: Font family (Poppins)
- **Component Overrides**: Pre-styled MUI components

**Usage**: Import in any page:
```javascript
import goldWhiteTheme from '../theme/muiTheme';

// Then wrap component
<ThemeProvider theme={goldWhiteTheme}>
  <YourComponent />
</ThemeProvider>
```

### 3. Styled Components
**Pattern**: Most custom styling uses `styled-components`

```javascript
import styled from 'styled-components';

export const GoldButton = styled(Button)`
  && {
    background-color: #D4AF37;
    color: white;
    &:hover {
      background-color: #FFFFFF;
      color: #D4AF37;
    }
  }
`;
```

**Key Points**:
- `&&` double selector increases specificity over MUI defaults
- All color values should use the theme hex codes
- Transitions for smooth color changes

## 🔧 How to Add New Components

### Option 1: Using MUI Components (Recommended)
```javascript
import { Button, TextField, Box } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import goldWhiteTheme from '../theme/muiTheme';

export function MyComponent() {
  return (
    <ThemeProvider theme={goldWhiteTheme}>
      <Button variant="contained">Click Me</Button>
      {/* Automatically uses gold theme */}
    </ThemeProvider>
  );
}
```

**Benefit**: All MUI components automatically inherit theme colors.

### Option 2: Styled Components (Custom Styling)
```javascript
import styled from 'styled-components';

const MyCustomButton = styled.button`
  background-color: #D4AF37;  // Use theme hex directly
  color: #FFFFFF;
  border: 1px solid #B88F2A;
  
  &:hover {
    background-color: #B88F2A;
  }
`;
```

**Benefit**: Full control over styles, not limited by MUI.

### Option 3: Inline Styles (For Dynamic Values)
```javascript
<Box sx={{
  backgroundColor: '#D4AF37',
  color: '#FFFFFF',
  '&:hover': {
    backgroundColor: '#B88F2A'
  }
}} />
```

**Benefit**: Quick one-off styling, inherits from theme.

## 📋 Color Decision Tree

When styling a new element, ask:

```
┌─ Is it a main action button?
│  └─ Use Gold #D4AF37 on White background
│
├─ Is it secondary / outline?
│  └─ Use Gold border, white background
│
├─ Is it a heading / important text?
│  └─ Use Gold #D4AF37
│
├─ Is it body text?
│  └─ Use Dark Gray #111111
│
├─ Is it a background / container?
│  └─ Use White #FFFFFF or Muted #F7F6F4
│
└─ Is it a hover / focus state?
   └─ Use Dark Gold #B88F2A or invert colors
```

## 🎨 Color Reference

| Use Case | Color | Hex | Usage |
|----------|-------|-----|-------|
| Primary Button | Gold | #D4AF37 | `background: var(--color-gold)` |
| Button Hover | Dark Gold | #B88F2A | `&:hover: background: var(--color-gold-dark)` |
| Text (Primary) | Dark Gray | #111111 | `color: var(--color-text)` |
| Backgrounds | White | #FFFFFF | `background: var(--color-white)` |
| Subtle BG | Muted | #F7F6F4 | `background: var(--color-muted)` |
| Borders | Gold Dark | #B88F2A | `border: 1px solid var(--color-gold-dark)` |

## 🔐 Theme Hierarchy

```
goldWhiteTheme (muiTheme.js)
├─ Palette
│  ├─ primary: Gold (#D4AF37)
│  ├─ secondary: White (#FFFFFF)
│  ├─ text: Dark Gray (#111111)
│  └─ background: Off-White (#F7F6F4)
│
├─ Typography
│  └─ fontFamily: "Poppins", sans-serif
│
└─ Components
   ├─ Button: Gold with white text, white on hover
   ├─ TextField: Gold focus ring
   ├─ AppBar: Gold background
   ├─ Drawer: White with gold border
   ├─ TableCell: Gold header
   └─ ... (20+ component overrides)
```

## 🚀 Common Patterns

### Gold Button
```javascript
// Option 1: MUI (auto-gold from theme)
<Button variant="contained">Click Me</Button>

// Option 2: Styled-Components
<GoldButton>Click Me</GoldButton>

// Option 3: Inline
<Button sx={{ backgroundColor: '#D4AF37', color: '#fff' }}>Click</Button>
```

### Gold Input
```javascript
// MUI TextField (auto-gold on focus from theme)
<TextField
  label="Username"
  variant="outlined"
/>

// Styled
<StyledInput style={{ borderColor: '#D4AF37' }} />
```

### Gold Link
```javascript
// MUI (auto-gold from theme)
<Link href="/page">Click Here</Link>

// Styled
<StyledLink to="/page" style={{ color: '#D4AF37' }}>Click</StyledLink>
```

## 🛠️ Maintenance Tips

### Adding a New Color
If you need to add a new color to the palette:

1. **Define in `src/index.css`**:
   ```css
   :root {
     --color-gold: #D4AF37;
     --color-custom: #NEWVALUE; /* Add here */
   }
   ```

2. **Update `src/theme/muiTheme.js`**:
   ```javascript
   palette: {
     // ... existing
     custom: {
       main: '#NEWVALUE'
     }
   }
   ```

3. **Use throughout**:
   ```css
   color: var(--color-custom);
   ```

### Updating Button Styles
If you want to change all button hover behavior:

1. Edit `src/components/buttonStyles.js` to update all variants
2. OR Edit `src/theme/muiTheme.js` MuiButton styleOverrides
3. Test across all pages

### Checking Contrast
Use tools to verify accessibility:
- Chrome DevTools: Right-click element → Inspect → Colors tab
- WebAIM Contrast Checker: https://webaim.org/resources/contrastchecker/
- Target: WCAG AA (4.5:1) minimum for text

## 🧪 Testing the Theme

### Manual Testing
```bash
npm start
# Visit http://localhost:3000/choose
# Hover over cards - should show gold on white
# Click buttons - should be gold
```

### Automated Testing (Future)
```javascript
// Example test (Jest)
test('button uses gold theme color', () => {
  const { getByText } = render(<GoldButton>Click</GoldButton>);
  const button = getByText('Click');
  expect(button).toHaveStyle('background-color: #D4AF37');
});
```

## 📚 Related Files

- Theme definition: [src/theme/muiTheme.js](src/theme/muiTheme.js)
- CSS variables: [src/index.css](src/index.css)
- Button styles: [src/components/buttonStyles.js](src/components/buttonStyles.js)
- Theme log: [THEME-MIGRATION-LOG.md](THEME-MIGRATION-LOG.md)
- Visual guide: [THEME-VISUAL-GUIDE.md](THEME-VISUAL-GUIDE.md)

---

**Happy Theming! 🎨**

If you need to modify or extend the theme, follow these patterns and all new components will automatically use the gold & white palette.
