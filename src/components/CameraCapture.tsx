import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Camera, RefreshCw, X, Check } from "lucide-react";

interface CameraCaptureProps {
  onCapture: (imageData: string) => void;
  capturedImage?: string | null;
  label?: string;
}

export function CameraCapture({ onCapture, capturedImage, label = "Capture Photo" }: CameraCaptureProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startCamera = useCallback(async () => {
    try {
      setError(null);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 640 }, height: { ideal: 480 } },
        audio: false,
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError("Unable to access camera. Please check permissions.");
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  }, [stream]);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      setPreviewImage(null);
      startCamera();
    } else {
      stopCamera();
      setPreviewImage(null);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const imageData = canvas.toDataURL("image/jpeg", 0.8);
        setPreviewImage(imageData);
        stopCamera();
      }
    }
  };

  const retakePhoto = () => {
    setPreviewImage(null);
    startCamera();
  };

  const confirmCapture = () => {
    if (previewImage) {
      onCapture(previewImage);
      setIsOpen(false);
      setPreviewImage(null);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Preview of captured image */}
      <div className="h-40 w-40 rounded-xl bg-muted flex items-center justify-center border-2 border-dashed border-border overflow-hidden">
        {capturedImage ? (
          <img src={capturedImage} alt="Captured" className="h-full w-full object-cover" />
        ) : (
          <Camera className="h-12 w-12 text-muted-foreground" />
        )}
      </div>

      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <Button variant="outline">
            <Camera className="mr-2 h-4 w-4" />
            {capturedImage ? "Retake Photo" : label}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5" />
              {label}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {error ? (
              <div className="h-64 bg-destructive/10 rounded-lg flex items-center justify-center text-destructive text-center p-4">
                {error}
              </div>
            ) : previewImage ? (
              <div className="relative">
                <img src={previewImage} alt="Preview" className="w-full rounded-lg" />
              </div>
            ) : (
              <div className="relative">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full rounded-lg bg-muted"
                />
              </div>
            )}

            <canvas ref={canvasRef} className="hidden" />

            <div className="flex gap-2 justify-center">
              {previewImage ? (
                <>
                  <Button variant="outline" onClick={retakePhoto}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Retake
                  </Button>
                  <Button onClick={confirmCapture} variant="accent">
                    <Check className="mr-2 h-4 w-4" />
                    Use Photo
                  </Button>
                </>
              ) : (
                <Button onClick={capturePhoto} disabled={!stream} size="lg" className="px-8">
                  <Camera className="mr-2 h-5 w-5" />
                  Capture
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
