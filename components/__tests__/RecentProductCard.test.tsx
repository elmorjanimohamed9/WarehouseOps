import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import RecentProductCard from '../products/RecentProductCard';

describe('RecentProductCard', () => {
  // Dummy product data
  const dummyProduct = {
    id: 1,
    name: 'Test Recent Product',
    type: 'Test Category',
    price: 199.99,
    image: 'https://example.com/recent.jpg',
    editedBy: [
      {
        at: '2022-01-01T00:00:00Z',
      },
    ],
  };

  it('renders product details correctly', () => {
    const formattedDate = new Date(dummyProduct.editedBy[0].at).toLocaleDateString();

    const { getByText } = render(
      <RecentProductCard
        product={dummyProduct}
        onPress={() => {}}
      />
    );

    expect(getByText(dummyProduct.name)).toBeTruthy();
    expect(getByText(dummyProduct.type)).toBeTruthy();
    expect(getByText(new RegExp(`${dummyProduct.price.toLocaleString()}`))).toBeTruthy();
    expect(getByText(`Added ${formattedDate}`)).toBeTruthy();
  });

  it('calls onPress when the card is pressed', () => {
    const onPressMock = jest.fn();

    const { getByTestId } = render(
      <RecentProductCard
        product={dummyProduct}
        onPress={onPressMock}
      />
    );

    const touchable = getByTestId('recent-product-card-touchable');
    fireEvent.press(touchable);

    expect(onPressMock).toHaveBeenCalledTimes(1);
  });
});
