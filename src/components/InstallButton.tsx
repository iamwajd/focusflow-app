import { useEffect, useState } from "react";
import { Download } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const InstallButton = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showButton, setShowButton] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
      return;
    }

    // Detect iOS
    const userAgent = navigator.userAgent.toLowerCase();
    const iosDetected = /iphone|ipad|ipod|safari/.test(userAgent) && 
                       !/chrome|crios|firefox|fxios/.test(userAgent);
    setIsIOS(iosDetected);

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      const event = e as BeforeInstallPromptEvent;
      setDeferredPrompt(event);
      setShowButton(true);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowButton(false);
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    // For iOS or when beforeinstallprompt isn't available, show button anyway
    if (iosDetected) {
      setShowButton(true);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt && !isIOS) {
      return;
    }

    if (deferredPrompt) {
      // Use system install prompt if available
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;

      if (outcome === "accepted") {
        setIsInstalled(true);
      }

      setDeferredPrompt(null);
      setShowButton(false);
    }
  };

  if (isInstalled || !showButton) {
    return null;
  }

  if (isIOS) {
    // iOS - Show tooltip with Share instructions
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button className="p-2 rounded-full hover:bg-muted transition-colors text-primary hover:text-primary/80">
              <Download size={20} />
            </button>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="text-center max-w-xs">
            <p className="font-semibold mb-1">لتثبيت التطبيق</p>
            <p className="text-sm">اضغط على مشاركة (Share)</p>
            <p className="text-sm">ثم "أضف إلى الشاشة الرئيسية"</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  // Non-iOS - Standard install button
  return (
    <button
      onClick={handleInstall}
      className="p-2 rounded-full hover:bg-muted transition-colors text-primary hover:text-primary/80"
      title="Install FocusFlow"
    >
      <Download size={20} />
    </button>
  );
};

export default InstallButton;
