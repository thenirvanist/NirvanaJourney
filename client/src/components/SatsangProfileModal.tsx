import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

interface SatsangProfile {
  id?: number;
  profile_id: string;
  gender?: string;
  age?: number;
  location?: string;
  current_vocation?: string;
  field_of_study?: string;
  prefer_1_on_1?: boolean;
}

interface SatsangProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  existingProfile?: SatsangProfile | null;
}

export default function SatsangProfileModal({ 
  open, 
  onOpenChange, 
  userId, 
  existingProfile 
}: SatsangProfileModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState({
    gender: "",
    age: "",
    location: "",
    current_vocation: "",
    field_of_study: "",
    prefer_1_on_1: false,
  });

  useEffect(() => {
    if (existingProfile) {
      setFormData({
        gender: existingProfile.gender || "",
        age: existingProfile.age?.toString() || "",
        location: existingProfile.location || "",
        current_vocation: existingProfile.current_vocation || "",
        field_of_study: existingProfile.field_of_study || "",
        prefer_1_on_1: existingProfile.prefer_1_on_1 || false,
      });
    } else {
      setFormData({
        gender: "",
        age: "",
        location: "",
        current_vocation: "",
        field_of_study: "",
        prefer_1_on_1: false,
      });
    }
  }, [existingProfile, open]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!supabase) throw new Error("Supabase not initialized");
      
      const profileData = {
        profile_id: userId,
        gender: formData.gender || null,
        age: formData.age ? parseInt(formData.age) : null,
        location: formData.location || null,
        current_vocation: formData.current_vocation || null,
        field_of_study: formData.field_of_study || null,
        prefer_1_on_1: formData.prefer_1_on_1,
      };

      const { error } = await supabase
        .from("satsang_profile")
        .upsert(profileData, { onConflict: "profile_id" });
      
      if (error) throw error;
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["satsang-profile", userId] });
      toast({
        title: "Profile Saved!",
        description: "Your satsang profile has been updated.",
      });
      onOpenChange(false);
    },
    onError: (error: any) => {
      console.error("Error saving satsang profile:", error);
      console.error("Error details:", JSON.stringify(error, null, 2));
      const errorMessage = error?.message || error?.details || "Failed to save your profile. Please try again.";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Welcome to Satsangs</DialogTitle>
          <DialogDescription className="italic text-gray-600">
            <span className="font-semibold not-italic">Aligning Your Experience</span> — To ensure the most meaningful dialogue, we curate Satsang groups based on shared life stages and experiences. This helps us place you with peers where the conversation will naturally resonate.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="gender">Gender</Label>
            <Select 
              value={formData.gender} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, gender: value }))}
            >
              <SelectTrigger id="gender">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="non-binary">Non-binary</SelectItem>
                <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="age">Age</Label>
            <Input
              id="age"
              type="number"
              min="13"
              max="120"
              placeholder="Your age"
              value={formData.age}
              onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              type="text"
              placeholder="City, Country"
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="current_vocation">Current Vocation</Label>
            <Input
              id="current_vocation"
              type="text"
              placeholder="e.g., Software Engineer, Teacher, Student"
              value={formData.current_vocation}
              onChange={(e) => setFormData(prev => ({ ...prev, current_vocation: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="field_of_study">Field of Study</Label>
            <Input
              id="field_of_study"
              type="text"
              placeholder="e.g., Philosophy, Computer Science, Medicine"
              value={formData.field_of_study}
              onChange={(e) => setFormData(prev => ({ ...prev, field_of_study: e.target.value }))}
            />
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <Checkbox
              id="prefer_1_on_1"
              checked={formData.prefer_1_on_1}
              onCheckedChange={(checked) => 
                setFormData(prev => ({ ...prev, prefer_1_on_1: checked === true }))
              }
            />
            <Label 
              htmlFor="prefer_1_on_1" 
              className="text-sm font-normal cursor-pointer"
            >
              I prefer 1-on-1 sessions rather than a group setting.
            </Label>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="brand-primary hover:brand-bright text-white hover:text-black"
              disabled={saveMutation.isPending}
            >
              {saveMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                existingProfile ? "Update Profile" : "Save Profile"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
