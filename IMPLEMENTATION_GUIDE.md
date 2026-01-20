# Implementation Guide & Examples

## 🎨 Design System Implementation

### Gold Theme Color Usage

```jsx
// Primary Buttons
<button className="bg-gold-500 text-white hover:bg-gold-600">
  Action Button
</button>

// Cards with Gold Borders
<Card className="border-l-4 border-gold-500 shadow-gold-md">
  Important Content
</Card>

// Gold Text & Icons
<div className="text-gold-700">
  <FiShield size={24} className="text-gold-600" />
  <span className="text-sm text-gold-700">Gold Text</span>
</div>

// Gold Gradients
<div className="bg-gradient-to-r from-gold-500 to-gold-700">
  Header Section
</div>
```

## 📊 Component Pattern Examples

### Modal Dialog Pattern
```jsx
import { Dialog, Transition } from '@headlessui/react';
import { motion } from 'framer-motion';

const [isOpen, setIsOpen] = useState(false);

return (
  <>
    <button onClick={() => setIsOpen(true)}>Open Modal</button>
    
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" onClose={() => setIsOpen(false)}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <Dialog.Panel className="bg-white rounded-xl p-6">
          <Dialog.Title className="text-lg font-bold">
            Modal Title
          </Dialog.Title>
          {/* Content */}
        </Dialog.Panel>
      </Dialog>
    </Transition>
  </>
);
```

### Animated List Pattern
```jsx
const items = [...];

return (
  <div className="space-y-4">
    {items.map((item, idx) => (
      <motion.div
        key={item.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: idx * 0.05 }}
      >
        <Card>{/* Item content */}</Card>
      </motion.div>
    ))}
  </div>
);
```

### Toast Notification Pattern
```jsx
import { toast } from 'react-hot-toast';

// Success
toast.success('Operation completed!');

// Error
toast.error('Something went wrong');

// Custom
toast((t) => (
  <div className="p-4 bg-gold-50 rounded-lg">
    Custom notification
  </div>
));
```

### Chart Integration Pattern
```jsx
import { LineChart, Line, ResponsiveContainer } from 'recharts';

const data = [
  { month: 'Jan', value: 100 },
  { month: 'Feb', value: 120 },
];

<ResponsiveContainer width="100%" height={300}>
  <LineChart data={data}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="month" />
    <YAxis />
    <Tooltip />
    <Line type="monotone" dataKey="value" stroke="#D4AF37" />
  </LineChart>
</ResponsiveContainer>
```

## 🔄 Redux Integration Pattern

### State Management
```jsx
// In slice (e.g., src/redux/slices/transportSlice.js)
import { createSlice } from '@reduxjs/toolkit';

const transportSlice = createSlice({
  name: 'transport',
  initialState: {
    routes: [],
    loading: false,
  },
  reducers: {
    addRoute: (state, action) => {
      state.routes.push(action.payload);
    },
    removeRoute: (state, action) => {
      state.routes = state.routes.filter(r => r.id !== action.payload);
    },
  },
});

// In component
import { useDispatch, useSelector } from 'react-redux';

const routes = useSelector(state => state.transport.routes);
const dispatch = useDispatch();

dispatch(addRoute(newRoute));
```

## 📱 Responsive Pattern

```jsx
// Mobile first approach with Tailwind
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Items automatically stack on mobile */}
</div>

// Flex layouts
<div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
  {/* Vertical on mobile, horizontal on desktop */}
</div>

// Conditional rendering
<div className="hidden md:flex items-center">
  {/* Only visible on medium+ screens */}
</div>
```

## 🔐 Role-Based Access Control

```jsx
// In components/RouteGuards.jsx
export const AdminOnly = ({ children }) => {
  const { user } = useSelector(state => state.auth);
  
  if (user?.role !== 'Admin') {
    return <Navigate to="/dashboard" />;
  }
  
  return children;
};

// Usage in routes
<Route
  path="/admin"
  element={
    <AdminOnly>
      <AdminSection />
    </AdminOnly>
  }
/>
```

## 🧪 Testing New Features

### Add a New Module

1. **Create Page Component**
```jsx
// src/pages/NewModule.jsx
const NewModule = () => {
  return (
    <div className="space-y-6">
      <motion.div className="bg-gradient-to-r from-gold-500 to-gold-700...">
        <h1 className="text-4xl font-bold">Module Title</h1>
      </motion.div>
      
      {/* Your content */}
    </div>
  );
};

export default NewModule;
```

2. **Register Route in App.jsx**
```jsx
const NewModule = React.lazy(() => import('./pages/NewModule'));

// In Routes section
<Route path="/new-module" element={<NewModule />} />
```

3. **Add to Menu in utils/constants.js**
```javascript
Admin: [
  // ... existing items
  { label: 'New Module', path: '/new-module', icon: 'FiBox' },
],
```

## 🎯 Common Patterns & Templates

### Form with Validation
```jsx
const [formData, setFormData] = useState({
  name: '',
  email: '',
});

const handleSubmit = () => {
  if (!formData.name) {
    toast.error('Please enter name');
    return;
  }
  
  // Submit logic
  toast.success('Form submitted!');
};

return (
  <div className="space-y-4">
    <input
      value={formData.name}
      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
      className="w-full px-4 py-2 border border-beige-200 rounded-lg"
    />
    <button onClick={handleSubmit} className="bg-gold-500 text-white px-6 py-2">
      Submit
    </button>
  </div>
);
```

### Search & Filter Pattern
```jsx
const [searchQuery, setSearchQuery] = useState('');
const [filterType, setFilterType] = useState('all');

const filtered = data.filter(item => {
  const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
  const matchesFilter = filterType === 'all' || item.type === filterType;
  return matchesSearch && matchesFilter;
});

return (
  <>
    {/* Search Input */}
    <input
      placeholder="Search..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      className="w-full px-4 py-2 border border-beige-200 rounded-lg"
    />
    
    {/* Filter Buttons */}
    <div className="flex gap-2">
      {['all', 'type1', 'type2'].map(type => (
        <button
          key={type}
          onClick={() => setFilterType(type)}
          className={filterType === type ? 'bg-gold-500 text-white' : 'bg-gray-200'}
        >
          {type}
        </button>
      ))}
    </div>
    
    {/* Filtered Results */}
    <div className="space-y-4">
      {filtered.map(item => (
        <Card key={item.id}>{item.name}</Card>
      ))}
    </div>
  </>
);
```

### Data Table Pattern
```jsx
<table className="w-full">
  <thead>
    <tr className="border-b border-beige-200">
      <th className="text-left px-4 py-2 font-bold text-gold-700">Name</th>
      <th className="text-left px-4 py-2 font-bold text-gold-700">Status</th>
      <th className="text-left px-4 py-2 font-bold text-gold-700">Actions</th>
    </tr>
  </thead>
  <tbody>
    {data.map(row => (
      <tr key={row.id} className="border-b border-beige-200 hover:bg-gold-50">
        <td className="px-4 py-2">{row.name}</td>
        <td className="px-4 py-2">
          <span className="px-2 py-1 bg-green-100 text-green-700 rounded">
            {row.status}
          </span>
        </td>
        <td className="px-4 py-2">
          <button className="text-blue-600 hover:bg-blue-50 p-2 rounded">
            Edit
          </button>
        </td>
      </tr>
    ))}
  </tbody>
</table>
```

## 🎨 Styling Quick Reference

### Card Container
```jsx
<Card className="hover:shadow-gold-md transition">
  Content
</Card>
```

### Section Header
```jsx
<motion.div className="bg-gradient-to-r from-gold-500 to-gold-700 rounded-xl p-8 text-white">
  <h1 className="text-4xl font-bold mb-2">Title</h1>
  <p className="text-gold-100">Subtitle</p>
</motion.div>
```

### Button Styles
```jsx
// Primary Gold
<button className="bg-gold-500 hover:bg-gold-600 text-white">

// Secondary
<button className="border border-beige-200 text-gray-700 hover:bg-beige-50">

// Icon Button
<button className="p-2 text-gold-600 hover:bg-gold-50 rounded-lg">

// Danger
<button className="text-red-600 hover:bg-red-50">
```

### Badge/Tag
```jsx
<span className="inline-block px-3 py-1 bg-gold-100 text-gold-700 rounded-full text-sm font-medium">
  Badge
</span>
```

## 📚 Best Practices

1. **Always use Tailwind classes** - Don't add custom CSS
2. **Animate with Framer Motion** - For smooth interactions
3. **Use Toast for feedback** - Not console.log
4. **Lazy load pages** - Reduce bundle size
5. **Memoize list items** - Improve performance
6. **Use proper ARIA labels** - For accessibility
7. **Test responsive** - Mobile, tablet, desktop
8. **Keep components small** - Single responsibility
9. **Extract repeated code** - Into reusable components
10. **Comment complex logic** - Make code maintainable

## 🔗 File Navigation Quick Links

- **Color Theme**: `tailwind.config.js`
- **Menu Items**: `src/utils/constants.js`
- **Redux State**: `src/redux/store.js`, `src/redux/slices/`
- **Mock Data**: `src/mocks/dummyData.js`, `src/utils/mockApi.js`
- **Components**: `src/components/`
- **Pages**: `src/pages/`
- **Routing**: `src/App.jsx`

---

Use these patterns and examples as templates for extending the application with new features!
