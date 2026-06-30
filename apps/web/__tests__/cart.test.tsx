import { renderHook, act } from '@testing-library/react';
import { useCart } from '../src/lib/hooks/useCart';

describe('useCart Zustand Store', () => {
  beforeEach(() => {
    // Clear cart before each test
    const { result } = renderHook(() => useCart());
    act(() => {
      result.current.clearCart();
    });
  });

  it('should add an item to the cart', () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.addItem({
        productId: '1',
        name: 'Test Shirt',
        price: 25.0,
        quantity: 1,
      });
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].name).toBe('Test Shirt');
    expect(result.current.getTotalItems()).toBe(1);
    expect(result.current.getTotalPrice()).toBe(25.0);
  });

  it('should increment quantity when adding the same item', () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.addItem({ productId: '1', name: 'Test Shirt', price: 25.0, quantity: 1 });
      result.current.addItem({ productId: '1', name: 'Test Shirt', price: 25.0, quantity: 2 });
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].quantity).toBe(3);
    expect(result.current.getTotalPrice()).toBe(75.0);
  });

  it('should remove an item from the cart', () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.addItem({ productId: '1', name: 'Test Shirt', price: 25.0, quantity: 1 });
      result.current.removeItem('1');
    });

    expect(result.current.items).toHaveLength(0);
  });
});
