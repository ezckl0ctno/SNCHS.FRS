import { useEffect, useRef, useState } from "react";
import { descriptorFromVideo, loadFaceEngine } from "@/lib/school/face";
import { Button } from "@/components/ui/button";

export function FaceCapture({
  onCapture,
  autoScan = false,
  variant = "dark",
}: {
  onCapture: (descriptor: number[]) => void;
  autoScan?: boolean;
  variant?: "dark" | "paper";
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [hint, setHint] = useState("Starting camera…");
  const [ready, setReady] = useState(false);
  const scanningRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await loadFaceEngine();
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 480 } },
          audio: false,
        });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
        setReady(true);
        setHint(autoScan ? "Camera is scanning automatically…" : "Face the camera, then capture.");
      } catch {
        setHint("Camera is not available here. Use PIN at the gate instead.");
      }
    })();
    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, [autoScan]);

  useEffect(() => {
    if (!autoScan || !ready) return;
    const timer = window.setInterval(async () => {
      if (scanningRef.current || !videoRef.current) return;
      scanningRef.current = true;
      try {
        const descriptor = await descriptorFromVideo(videoRef.current);
        if (descriptor) onCapture(descriptor);
      } catch {
        setHint("Camera scan paused briefly. Trying again…");
      } finally {
        scanningRef.current = false;
      }
    }, 1400);
    return () => window.clearInterval(timer);
  }, [autoScan, onCapture, ready]);

  async function capture() {
    if (!videoRef.current) return;
    setHint("Looking for a face…");
    const descriptor = await descriptorFromVideo(videoRef.current);
    if (!descriptor) {
      setHint("No face found. Come closer, even light, look straight.");
      return;
    }
    onCapture(descriptor);
    setHint("Face captured.");
  }

  return (
    <div className="grid gap-3">
      <div className="overflow-hidden rounded-2xl bg-ink">
        <video ref={videoRef} className="aspect-[4/3] w-full object-cover" muted playsInline />
      </div>
      <p className={variant === "dark" ? "text-sm text-sky-soft" : "text-sm text-muted"}>{hint}</p>
      {!autoScan ? (
        <Button variant={variant === "dark" ? "sky" : "primary"} disabled={!ready} onClick={capture}>
          Capture face
        </Button>
      ) : null}
    </div>
  );
}
