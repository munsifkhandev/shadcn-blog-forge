import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Link as LinkIcon, X, ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ImageUploadProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
}

export const ImageUpload = ({ value, onChange, label = "Post Image" }: ImageUploadProps) => {
  const [activeTab, setActiveTab] = useState<"upload" | "url">("url");
  const [urlInput, setUrlInput] = useState(value || "");
  const [previewUrl, setPreviewUrl] = useState(value || "");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file size (max 2MB for localStorage)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 2MB.",
        variant: "destructive",
      });
      return;
    }

    // Check file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file.",
        variant: "destructive",
      });
      return;
    }

    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setPreviewUrl(base64String);
        onChange(base64String);
        toast({
          title: "Image uploaded",
          description: "Your image has been successfully uploaded.",
        });
      };
      reader.onerror = () => {
        toast({
          title: "Upload failed",
          description: "Failed to read the image file.",
          variant: "destructive",
        });
      };
      reader.readAsDataURL(file);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process the image.",
        variant: "destructive",
      });
    }
  };

  const handleUrlChange = (url: string) => {
    setUrlInput(url);
    onChange(url);
    setPreviewUrl(url);
  };

  const handleRemoveImage = () => {
    setPreviewUrl("");
    setUrlInput("");
    onChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-4">
      <Label>{label} (optional)</Label>
      
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "upload" | "url")}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="url">
            <LinkIcon className="h-4 w-4 mr-2" />
            Image URL
          </TabsTrigger>
          <TabsTrigger value="upload">
            <Upload className="h-4 w-4 mr-2" />
            Upload Image
          </TabsTrigger>
        </TabsList>

        <TabsContent value="url" className="space-y-3">
          <Input
            type="url"
            placeholder="https://example.com/image.jpg"
            value={urlInput}
            onChange={(e) => handleUrlChange(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Enter a direct link to an image hosted online
          </p>
        </TabsContent>

        <TabsContent value="upload" className="space-y-3">
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="flex-1"
            >
              <Upload className="h-4 w-4 mr-2" />
              Choose Image
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Upload from your computer (max 2MB)
          </p>
        </TabsContent>
      </Tabs>

      {/* Image Preview */}
      {previewUrl && (
        <div className="relative rounded-lg border border-border overflow-hidden bg-muted">
          <div className="aspect-video relative">
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-full object-cover"
              onError={() => {
                toast({
                  title: "Invalid image",
                  description: "Failed to load the image. Please check the URL or try a different image.",
                  variant: "destructive",
                });
                setPreviewUrl("");
              }}
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2"
              onClick={handleRemoveImage}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="p-3 bg-background/95 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <ImageIcon className="h-4 w-4" />
              <span className="truncate">
                {previewUrl.startsWith("data:") ? "Uploaded image" : previewUrl}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
