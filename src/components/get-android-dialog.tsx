import * as Dialog from "@radix-ui/react-dialog";
import { Download, Shield, Smartphone, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function GetAndroidDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (next: boolean) => void;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-bg/70" />
        <Dialog.Content className="fixed inset-x-0 bottom-0 z-50 mx-auto max-h-[88dvh] w-full max-w-lg overflow-y-auto rounded-t-2xl bg-surface p-4 shadow-border sm:inset-y-auto sm:top-1/2 sm:bottom-auto sm:max-h-[80dvh] sm:-translate-y-1/2 sm:rounded-2xl sm:p-5">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <Dialog.Title className="font-display text-xl text-fg">
                Flyway for Android
              </Dialog.Title>
              <Dialog.Description className="mt-1 text-sm text-muted">
                Install the app on your phone. Same live brief, works from the home screen.
              </Dialog.Description>
            </div>
            <Dialog.Close asChild>
              <Button variant="ghost" size="icon" aria-label="Close">
                <X />
              </Button>
            </Dialog.Close>
          </div>

          <a
            href="/flyway.apk"
            download="Flyway.apk"
            className="flex min-h-12 items-center justify-center gap-2 rounded-md bg-sage px-4 text-sm font-medium text-sage-fg hover:bg-sage/90"
          >
            <Download className="size-4" />
            Download Flyway.apk
          </a>

          <ol className="mt-5 space-y-3 text-sm leading-relaxed text-muted">
            <li className="flex gap-3">
              <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-elevated font-display text-xs text-fg">
                1
              </span>
              <span>Tap download. If Chrome warns that the file is uncommon, choose Download anyway.</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-elevated font-display text-xs text-fg">
                2
              </span>
              <span>
                Open the file. If Android blocks it, allow your browser to install unknown apps
                (Settings → Apps → Special app access → Install unknown apps).
              </span>
            </li>
            <li className="flex gap-3">
              <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-elevated font-display text-xs text-fg">
                3
              </span>
              <span>Tap Install, then Open. Pin a marsh and you’re hunting the same model as the web desk.</span>
            </li>
          </ol>

          <div className="mt-5 flex gap-3 rounded-md bg-elevated px-3 py-3 text-xs leading-relaxed text-muted">
            <Shield className="mt-0.5 size-4 shrink-0 text-sage" />
            <p>
              This is a sideloaded build, not a Play Store listing. It only needs network access for
              weather and location, and is signed so Android will install it.
            </p>
          </div>

          <p className="mt-4 flex items-center gap-2 text-xs text-subtle">
            <Smartphone className="size-3.5" />
            Android 7 and newer
          </p>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
