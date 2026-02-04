import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { useCars, type Car } from "./useCars";
import { useToast } from "@/hooks/use-toast";

interface CartItem {
  id: string;
  car_id: string;
  car: Car;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  loading: boolean;
  addToCart: (carId: string) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  getCartTotal: () => number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { data: carsData = [] } = useCars();
  const { toast } = useToast();

  const fetchCartItems = async () => {
    if (!user) {
      setItems([]);
      return;
    }

    setLoading(true);
    const { data, error } = await supabase
      .from("cart_items")
      .select("*")
      .eq("user_id", user.id);

    if (error) {
      console.error("Error fetching cart:", error);
      setLoading(false);
      return;
    }

    const cartItems: CartItem[] = (data || [])
      .map((item) => {
        const car = carsData.find((c) => c.id === item.car_id);
        if (!car) return null;
        return {
          id: item.id,
          car_id: item.car_id,
          car,
          quantity: item.quantity,
        };
      })
      .filter(Boolean) as CartItem[];

    setItems(cartItems);
    setLoading(false);
  };

  useEffect(() => {
    if (carsData.length > 0) {
      fetchCartItems();
    }
  }, [user, carsData]);

  const addToCart = async (carId: string) => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to sign in to add items to cart",
        variant: "destructive",
      });
      return;
    }

    // Check if already in cart
    const existing = items.find((item) => item.car_id === carId);
    if (existing) {
      toast({
        title: "Already in cart",
        description: "This car is already in your cart",
      });
      return;
    }

    const { error } = await supabase.from("cart_items").insert({
      user_id: user.id,
      car_id: carId,
      quantity: 1,
    });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to add to cart",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Added to cart",
      description: "Car has been added to your cart",
    });

    fetchCartItems();
  };

  const removeFromCart = async (itemId: string) => {
    const { error } = await supabase
      .from("cart_items")
      .delete()
      .eq("id", itemId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to remove from cart",
        variant: "destructive",
      });
      return;
    }

    setItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const clearCart = async () => {
    if (!user) return;

    const { error } = await supabase
      .from("cart_items")
      .delete()
      .eq("user_id", user.id);

    if (error) {
      console.error("Error clearing cart:", error);
      return;
    }

    setItems([]);
  };

  const getCartTotal = () => {
    return items.reduce((total, item) => total + item.car.price * item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        loading,
        addToCart,
        removeFromCart,
        clearCart,
        getCartTotal,
        itemCount: items.length,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);

  // Prevent blank screens if provider is temporarily missing (e.g. during HMR).
  // In normal operation, App.tsx wraps the app in <CartProvider />.
  if (context === undefined) {
    console.warn("useCart used without CartProvider");
    return {
      items: [],
      loading: false,
      addToCart: async () => {},
      removeFromCart: async () => {},
      clearCart: async () => {},
      getCartTotal: () => 0,
      itemCount: 0,
    } satisfies CartContextType;
  }

  return context;
};
