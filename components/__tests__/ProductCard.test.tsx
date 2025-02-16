import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import ProductCard from "../products/ProductCard"; // Adjust the import path as needed

describe("ProductCard", () => {
  const dummyProduct = {
    id: 1,
    name: "Test Product",
    type: "Test Type",
    price: 99.99,
    solde: 120,
    image: "https://example.com/image.jpg",
    supplier: "Test Supplier",
    stocks: [
      {
        quantity: 10,
        localisation: {
          city: "Test City",
        },
      },
    ],
  };

  it("renders product details correctly", () => {
    const { getByText } = render(
      <ProductCard product={dummyProduct} onPress={() => {}} />
    );

    expect(getByText(dummyProduct.name)).toBeTruthy();

    expect(getByText(dummyProduct.type)).toBeTruthy();

    expect(getByText(`$${dummyProduct.price.toLocaleString()}`)).toBeTruthy();

    expect(getByText(dummyProduct.supplier)).toBeTruthy();

    expect(getByText(/10 in stock/)).toBeTruthy();
  });

  it("calls onPress when the card is pressed", () => {
    const onPressMock = jest.fn();

    const { getByTestId } = render(
      <ProductCard product={dummyProduct} onPress={onPressMock} />
    );

    const touchable = getByTestId("product-card-touchable");
    fireEvent.press(touchable);

    expect(onPressMock).toHaveBeenCalledTimes(1);
  });
});
