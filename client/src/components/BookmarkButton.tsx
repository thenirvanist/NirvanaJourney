import { useState, type MouseEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";

interface BookmarkButtonProps {
  contentType: "sage" | "ashram" | "blog" | "journey" | "quote";
  contentId: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

interface Bookmark {
  id: number;
  user_id: string;
  content_type: string;
  content_id: number;
  created_at: string;
}

export function BookmarkButton({ 
  contentType, 
  contentId, 
  size = "md",
  className = ""
}: BookmarkButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user, isAuthenticated } = useAuth();

  // Fetch bookmarks directly from Supabase
  const { data: bookmarks = [] } = useQuery<Bookmark[]>({
    queryKey: ["supabase", "bookmarks", user?.id],
    queryFn: async () => {
      if (!user?.id || !supabase) return [];
      
      const { data, error } = await supabase
        .from("bookmarks")
        .select("*")
        .eq("user_id", user.id);
      
      if (error) {
        console.error("Error fetching bookmarks:", error);
        return [];
      }
      
      return data || [];
    },
    enabled: !!user?.id && !!supabase,
    retry: false
  });

  const isBookmarked = bookmarks.some(
    (bookmark: Bookmark) => 
      bookmark.content_type === contentType && 
      bookmark.content_id === contentId
  );

  // Add bookmark mutation using Supabase
  const addBookmark = useMutation({
    mutationFn: async () => {
      if (!supabase || !user?.id) {
        throw new Error("Not authenticated");
      }
      
      const { data, error } = await supabase
        .from("bookmarks")
        .insert({
          user_id: user.id,
          content_type: contentType,
          content_id: contentId
        })
        .select()
        .single();
      
      if (error) {
        if (error.code === "23505") {
          throw new Error("Already bookmarked");
        }
        throw error;
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["supabase", "bookmarks", user?.id] });
      toast({
        title: "Bookmarked!",
        description: "Added to your personal collection.",
        variant: "default"
      });
    },
    onError: (error: any) => {
      if (error.message === "Not authenticated") {
        toast({
          title: "Please sign in to bookmark",
          description: "You need to be logged in to save content to your collection.",
          variant: "destructive"
        });
      } else if (error.message === "Already bookmarked") {
        toast({
          title: "Already Bookmarked",
          description: "This content is already in your collection.",
          variant: "default"
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to add bookmark. Please try again.",
          variant: "destructive"
        });
      }
    }
  });

  // Remove bookmark mutation using Supabase
  const removeBookmark = useMutation({
    mutationFn: async () => {
      if (!supabase || !user?.id) {
        throw new Error("Not authenticated");
      }
      
      const { error } = await supabase
        .from("bookmarks")
        .delete()
        .eq("user_id", user.id)
        .eq("content_type", contentType)
        .eq("content_id", contentId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["supabase", "bookmarks", user?.id] });
      toast({
        title: "Removed",
        description: "Removed from your collection.",
        variant: "default"
      });
    },
    onError: (error: any) => {
      if (error.message === "Not authenticated") {
        toast({
          title: "Please sign in",
          description: "You need to be logged in to manage your collection.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to remove bookmark. Please try again.",
          variant: "destructive"
        });
      }
    }
  });

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      toast({
        title: "Please sign in to bookmark",
        description: "You need to be logged in to save content to your collection.",
        variant: "destructive"
      });
      return;
    }
    
    if (isBookmarked) {
      removeBookmark.mutate();
    } else {
      addBookmark.mutate();
    }
  };

  const iconSize = {
    sm: "h-4 w-4",
    md: "h-5 w-5", 
    lg: "h-6 w-6"
  }[size];

  const buttonSize = {
    sm: "p-1.5",
    md: "p-2",
    lg: "p-2.5"
  }[size];

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      disabled={addBookmark.isPending || removeBookmark.isPending}
      className={`
        ${buttonSize} 
        rounded-full 
        bg-white/90 
        backdrop-blur-sm 
        hover:bg-white 
        hover:scale-110 
        transition-all 
        duration-200 
        shadow-sm 
        ${className}
      `}
      data-testid={`bookmark-${contentType}-${contentId}`}
      title={isBookmarked ? "Remove from collection" : "Add to collection"}
    >
      {isBookmarked ? (
        <Heart 
          className={`${iconSize} fill-red-500 text-red-500`} 
        />
      ) : (
        <Heart 
          className={`${iconSize} text-gray-600 hover:text-red-500 transition-colors`} 
        />
      )}
    </Button>
  );
}
