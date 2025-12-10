import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Heart, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useWishlist } from '@/hooks/useWishlist';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CarCard from '@/components/CarCard';
import { Button } from '@/components/ui/button';

const Wishlist = () => {
  const { user, loading: authLoading } = useAuth();
  const { items, loading } = useWishlist();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-bordered flex items-center gap-3">
            <Heart className="h-8 w-8 text-primary" />
            My Wishlist
          </h1>
          <p className="text-muted-foreground mt-2">
            {items.length} {items.length === 1 ? 'car' : 'cars'} saved
          </p>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Your wishlist is empty</h2>
            <p className="text-muted-foreground mb-6">
              Save cars you're interested in to view them later
            </p>
            <Button asChild>
              <Link to="/#inventory">Browse Cars</Link>
            </Button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((item) => (
              <CarCard key={item.id} car={item.car} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Wishlist;
