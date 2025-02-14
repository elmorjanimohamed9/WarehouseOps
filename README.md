WarehouseOps/
├── src/
│   ├── api/
│   │   ├── config/
│   │   │   └── apiConfig.ts          # API configuration
│   │   ├── services/
│   │   │   ├── productService.ts     # Product API calls
│   │   │   ├── authService.ts        # Authentication API calls
│   │   │   └── warehouseService.ts   # Warehouse API calls
│   │   └── types/
│   │       └── api.types.ts          # API related types
│   │
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   └── Card.tsx
│   │   ├── products/
│   │   │   ├── ProductCard.tsx
│   │   │   ├── ProductList.tsx
│   │   │   └── ProductFilter.tsx
│   │   └── layout/
│   │       ├── Header.tsx
│   │       └── TabBar.tsx
│   │
│   ├── hooks/
│   │   ├── useProducts.ts
│   │   ├── useAuth.ts
│   │   └── useScanner.ts
│   │
│   ├── screens/
│   │   ├── auth/
│   │   │   ├── LoginScreen.tsx
│   │   │   └── SplashScreen.tsx
│   │   ├── main/
│   │   │   ├── HomeScreen.tsx
│   │   │   ├── SearchScreen.tsx
│   │   │   ├── ScanScreen.tsx
│   │   │   ├── StatsScreen.tsx
│   │   │   └── SettingsScreen.tsx
│   │   └── products/
│   │       ├── ProductDetailsScreen.tsx
│   │       └── AddProductScreen.tsx
│   │
│   ├── store/
│   │   ├── slices/
│   │   │   ├── productSlice.ts
│   │   │   └── authSlice.ts
│   │   └── store.ts
│   │
│   ├── utils/
│   │   ├── constants.ts
│   │   ├── helpers.ts
│   │   └── validation.ts
│   │
│   └── types/
│       ├── product.types.ts
│       └── warehouse.types.ts
│
├── assets/
│   ├── images/
│   └── fonts/
│
├── app/
│   ├── (tabs)/
│   │   └── _layout.tsx
│   └── index.tsx
│
├── api/
│   └── database/
│       └── db.json
│
└── config/
    ├── theme.ts
    └── navigation.ts