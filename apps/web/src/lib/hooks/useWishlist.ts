import { useState, useEffect } from 'react';
import { db } from 'shared/src/firebase/config';
import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { useAuth } from './useAuth';
import toast from 'react-hot-toast';

export function useWishlist() {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setWishlist([]);
      setLoading(false);
      return;
    }

    const fetchWishlist = async () => {
      setLoading(true);
      try {
        const docRef = doc(db, 'wishlists', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setWishlist(docSnap.data().items || []);
        } else {
          await setDoc(docRef, { items: [] });
          setWishlist([]);
        }
      } catch (error) {
        console.error("Error fetching wishlist:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [user]);

  const toggleWishlist = async (productId: string) => {
    if (!user) {
      toast.error('Please log in to add items to your wishlist');
      return false;
    }

    const isWished = wishlist.includes(productId);
    const docRef = doc(db, 'wishlists', user.uid);
    
    try {
      if (isWished) {
        await updateDoc(docRef, {
          items: arrayRemove(productId)
        });
        setWishlist(prev => prev.filter(id => id !== productId));
        toast.success('Removed from wishlist');
      } else {
        await updateDoc(docRef, {
          items: arrayUnion(productId)
        });
        setWishlist(prev => [...prev, productId]);
        toast.success('Added to wishlist');
      }
      return true;
    } catch (error) {
      console.error("Error updating wishlist:", error);
      toast.error('Failed to update wishlist');
      return false;
    }
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  return { wishlist, loading, toggleWishlist, isInWishlist };
}
