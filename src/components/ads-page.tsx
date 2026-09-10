import { Download, ImageIcon } from "lucide-react";
import { AppChrome } from "@/components/app-chrome";
import { AD_FILES, AD_ZIP } from "@/lib/flyway/ad-files";

export function AdsPage() {
  return (
    <div className="min-h-dvh">
      <AppChrome page="get" />
      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
        <p className="text-xs font-medium tracking-widest text-subtle uppercase">
          Advertise Flyway
        </p>
        <h1 className="mt-2 font-display text-3xl leading-tight text-fg sm:text-4xl">
          Ad images
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted sm:text-base">
          Tap a picture to save it, or grab the whole set. Same marsh look as the brief.
        </p>

        <a
          href={AD_ZIP.href}
          download={AD_ZIP.download}
          className="mt-6 flex min-h-12 items-center justify-center gap-2 rounded-md bg-sage px-4 text-sm font-medium text-sage-fg hover:bg-sage/90"
        >
          <Download className="size-4" />
          {AD_ZIP.label}
        </a>

        <ul className="mt-8 grid gap-4 sm:grid-cols-2">
          {AD_FILES.map((ad) => (
            <li key={ad.href}>
              <a
                href={ad.href}
                download={ad.download}
                className="block overflow-hidden rounded-2xl bg-surface shadow-border"
              >
                <img
                  src={ad.href}
                  alt={ad.label}
                  className="aspect-plate w-full object-cover"
                />
                <span className="flex items-start justify-between gap-2 px-3 py-3">
                  <span>
                    <span className="block text-sm text-fg">{ad.label}</span>
                    <span className="mt-1 block text-xs tracking-widest text-subtle uppercase">
                      {ad.size}
                    </span>
                  </span>
                  <ImageIcon className="mt-0.5 size-4 shrink-0 text-sage" />
                </span>
              </a>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
