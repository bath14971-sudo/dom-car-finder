import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';
import { carsData, Car } from '@/data/cars';

interface WishlistItem {
  id: string;
  car_id: string;
  car: Car;
}

interface WishlistContextType {
  items: WishlistItem[];
  loading: boolean;
  isInWishlist: (carId: string) => boolean;
  toggleWishlist: (carId: string) => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchWishlist = async () => {
    if (!user) {
      setItems([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('wishlist')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;

      const wishlistItems: WishlistItem[] = (data || [])
        .map(item => {
          const car = carsData.find(c => c.id === item.car_id);
          if (!car) return null;
          return {
            id: item.id,
            car_id: item.car_id,
            car
          };
        })
        .filter((item): item is WishlistItem => item !== null);

      setItems(wishlistItems);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, [user]);

  const isInWishlist = (carId: string) => {
    return items.some(item => item.car_id === carId);
  };

  const toggleWishlist = async (carId: string) => {
    if (!user) {
      toast.error('Please sign in to save to wishlist');
      return;
    }

    const existing = items.find(item => item.car_id === carId);

    if (existing) {
      // Remove from wishlist
      const { error } = await supabase
        .from('wishlist')
        .delete()
        .eq('id', existing.id);

      if (error) {
        toast.error('Failed to remove from wishlist');
        return;
      }

      setItems(prev => prev.filter(item => item.id !== existing.id));
      toast.success('Removed from wishlist');
    } else {
      // Add to wishlist
      const { data, error } = await supabase
        .from('wishlist')
        .insert({ user_id: user.id, car_id: carId })
        .select()
        .single();

      if (error) {
        toast.error('Failed to add to wishlist');
        return;
      }

      const car = carsData.find(c => c.id === carId);
      if (car && data) {
        setItems(prev => [...prev, { id: data.id, car_id: carId, car }]);
        toast.success('Added to wishlist');
      }
    }
  };

  return (
    <WishlistContext.Provider value={{ items, loading, isInWishlist, toggleWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
