import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ProductList from '../products/ProductList'; 

const mockPush = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

describe('ProductList', () => {
  const dummyProducts = [
    {
      id: 1,
      name: "Test Product",
      type: "Test Type",
      price: 99.99,
      solde: 120,
      supplier: "Test Supplier",
      image: "https://example.com/image.jpg",
      stocks: [
        {
          id: 1,
          name: "Main Warehouse",
          quantity: 10,
          localisation: {
            city: "Test City",
            latitude: 0,
            longitude: 0,
          },
        },
      ],
    },
  ];

  beforeEach(() => {
    mockPush.mockClear();
  });

  it('renders empty state when products array is empty', () => {
    const { getByText } = render(<ProductList products={[]} />);
    
    expect(getByText('No products found')).toBeTruthy();
    expect(getByText('Try adjusting your search or filters')).toBeTruthy();
  });

  it('renders product cards when products are available', () => {
    const { getByText } = render(<ProductList products={dummyProducts} />);
    
    expect(getByText(dummyProducts[0].name)).toBeTruthy();
  });

  it('navigates to product details on press', () => {
    const { getByTestId } = render(<ProductList products={dummyProducts} />);
    
    const productCardTouchable = getByTestId('product-card-touchable');
    
    fireEvent.press(productCardTouchable);
    
    expect(mockPush).toHaveBeenCalledWith(`/products/${dummyProducts[0].id}`);
  });
});
