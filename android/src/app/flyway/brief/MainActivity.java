package app.flyway.brief;

import android.Manifest;
import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.content.res.Configuration;
import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.view.View;
import android.view.Window;
import android.view.WindowInsets;
import android.view.WindowManager;
import android.webkit.JavascriptInterface;
import android.webkit.CookieManager;
import android.webkit.GeolocationPermissions;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.Charset;
import java.util.HashMap;
import java.util.Map;

public class MainActivity extends Activity {
    private static final int REQ_LOCATION = 42;
    private static final int REQ_FILE = 91;
    private static final String HOST = "app.flyway.brief";
    private static final String ORIGIN = "https://app.flyway.brief";
    private WebView webView;
    private FlywayStore store;
    private String pendingGeoOrigin;
    private GeolocationPermissions.Callback pendingGeoCallback;
    private ValueCallback<Uri[]> filePathCallback;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        paintSystemBars();

        webView = new WebView(this);
        webView.setBackgroundColor(Color.parseColor("#0E1210"));
        webView.setOverScrollMode(View.OVER_SCROLL_NEVER);

        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setGeolocationEnabled(true);
        settings.setAllowFileAccess(true);
        settings.setAllowContentAccess(true);
        settings.setLoadWithOverviewMode(false);
        settings.setUseWideViewPort(true);
        settings.setSupportZoom(false);
        settings.setBuiltInZoomControls(false);
        settings.setDisplayZoomControls(false);
        settings.setTextZoom(100);
        settings.setCacheMode(WebSettings.LOAD_DEFAULT);
        settings.setMediaPlaybackRequiresUserGesture(false);
        try {
            String dbPath = getDir("webview_db", Context.MODE_PRIVATE).getPath();
            settings.setDatabasePath(dbPath);
        } catch (Exception ignored) {
            // setDatabasePath is deprecated; ignore if the device rejects it.
        }
        if (Build.VERSION.SDK_INT >= 21) {
            settings.setMixedContentMode(WebSettings.MIXED_CONTENT_COMPATIBILITY_MODE);
            CookieManager.getInstance().setAcceptThirdPartyCookies(webView, true);
        }
        CookieManager.getInstance().setAcceptCookie(true);
        store = new FlywayStore(this);
        webView.addJavascriptInterface(store, "FlywayStore");
        webView.addJavascriptInterface(new FlywayNotify(this), "FlywayNotify");
        webView.addJavascriptInterface(new ChromeBridge(), "FlywayChrome");

        webView.setWebViewClient(new WebViewClient() {
            @Override
            public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
                Uri uri = request.getUrl();
                if (uri != null && HOST.equals(uri.getHost())) {
                    return serveAsset(uri.getPath());
                }
                return super.shouldInterceptRequest(view, request);
            }

            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                Uri uri = request.getUrl();
                if (uri == null) return true;
                String host = uri.getHost();
                String scheme = uri.getScheme();
                if (HOST.equals(host)) return false;
                return !(scheme != null && (scheme.equals("https") || scheme.equals("http")));
            }

            @Override
            public void onPageFinished(WebView view, String url) {
                pushInsetsToWeb();
            }
        });

        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public void onGeolocationPermissionsShowPrompt(
                    String origin, GeolocationPermissions.Callback callback) {
                if (Build.VERSION.SDK_INT >= 23
                        && checkSelfPermission(Manifest.permission.ACCESS_FINE_LOCATION)
                            != PackageManager.PERMISSION_GRANTED) {
                    pendingGeoOrigin = origin;
                    pendingGeoCallback = callback;
                    requestPermissions(
                            new String[] {
                                Manifest.permission.ACCESS_FINE_LOCATION,
                                Manifest.permission.ACCESS_COARSE_LOCATION
                            },
                            REQ_LOCATION);
                    return;
                }
                callback.invoke(origin, true, false);
            }

            @Override
            public boolean onShowFileChooser(
                    WebView view,
                    ValueCallback<Uri[]> callback,
                    WebChromeClient.FileChooserParams params) {
                if (filePathCallback != null) {
                    filePathCallback.onReceiveValue(null);
                }
                filePathCallback = callback;
                Intent intent;
                try {
                    intent = params.createIntent();
                } catch (Exception e) {
                    intent = new Intent(Intent.ACTION_GET_CONTENT);
                    intent.addCategory(Intent.CATEGORY_OPENABLE);
                    intent.setType("image/*");
                }
                try {
                    startActivityForResult(intent, REQ_FILE);
                } catch (Exception e) {
                    filePathCallback = null;
                    if (callback != null) callback.onReceiveValue(null);
                    return false;
                }
                return true;
            }
        });

        webView.loadUrl(ORIGIN + "/index.html");
        fitWebViewToSystemBars(webView);
        setContentView(webView);
    }

    private WebResourceResponse serveAsset(String path) {
        if (path == null || path.isEmpty() || "/".equals(path)) {
            path = "/index.html";
        }
        String relative = path.startsWith("/") ? path.substring(1) : path;
        String assetPath = "www/" + relative;
        String mime = mimeFrom(relative);
        try {
            InputStream in = getAssets().open(assetPath);
            if (relative.equals("index.html")) {
                String html = slurp(in);
                html = injectBoot(html);
                in = new ByteArrayInputStream(html.getBytes(Charset.forName("UTF-8")));
                mime = "text/html";
            }
            Map<String, String> headers = new HashMap<String, String>();
            headers.put("Cache-Control", "no-cache");
            headers.put("Access-Control-Allow-Origin", "*");
            if (Build.VERSION.SDK_INT >= 21) {
                return new WebResourceResponse(mime, "utf-8", 200, "OK", headers, in);
            }
            return new WebResourceResponse(mime, "utf-8", in);
        } catch (IOException e) {
            return null;
        }
    }

    private static String mimeFrom(String path) {
        String lower = path.toLowerCase();
        if (lower.endsWith(".html")) return "text/html";
        if (lower.endsWith(".js")) return "application/javascript";
        if (lower.endsWith(".css")) return "text/css";
        if (lower.endsWith(".png")) return "image/png";
        if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "image/jpeg";
        if (lower.endsWith(".svg")) return "image/svg+xml";
        if (lower.endsWith(".woff2")) return "font/woff2";
        if (lower.endsWith(".json")) return "application/json";
        return "application/octet-stream";
    }

    private String injectBoot(String html) {
        String boot = "{}";
        if (store != null) {
            boot = store.dumpJson();
        }
        boot = boot.replace("<", "\\u003c");
        String insets = insetsCssJson();
        String tag = insetsStyleTag()
                + "<script>window.__FLYWAY_BOOT__=" + boot
                + ";window.__FLYWAY_INSETS__=" + insets + ";</script>";
        int head = html.indexOf("</head>");
        if (head >= 0) {
            return html.substring(0, head) + tag + html.substring(head);
        }
        return tag + html;
    }

    private static String slurp(InputStream in) throws IOException {
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        byte[] buf = new byte[4096];
        int n;
        while ((n = in.read(buf)) != -1) {
            out.write(buf, 0, n);
        }
        in.close();
        return new String(out.toByteArray(), Charset.forName("UTF-8"));
    }

    private void paintSystemBars() {
        Window window = getWindow();
        int bg = Color.parseColor("#0E1210");
        window.setBackgroundDrawable(new ColorDrawable(bg));
        if (Build.VERSION.SDK_INT >= 21) {
            window.addFlags(WindowManager.LayoutParams.FLAG_DRAWS_SYSTEM_BAR_BACKGROUNDS);
            window.clearFlags(WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS);
            window.setStatusBarColor(Color.TRANSPARENT);
            window.setNavigationBarColor(Color.TRANSPARENT);
        }
        if (Build.VERSION.SDK_INT >= 30) {
            window.setDecorFitsSystemWindows(false);
            window.setStatusBarContrastEnforced(false);
            window.setNavigationBarContrastEnforced(false);
        }
        if (Build.VERSION.SDK_INT >= 28) {
            WindowManager.LayoutParams lp = window.getAttributes();
            lp.layoutInDisplayCutoutMode =
                    WindowManager.LayoutParams.LAYOUT_IN_DISPLAY_CUTOUT_MODE_SHORT_EDGES;
            window.setAttributes(lp);
        }
        if (Build.VERSION.SDK_INT >= 23) {
            window.getDecorView().setSystemUiVisibility(
                    View.SYSTEM_UI_FLAG_LAYOUT_STABLE
                            | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
                            | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION);
        }
    }

    private void fitWebViewToSystemBars(final WebView view) {
        view.setFitsSystemWindows(false);
        view.setPadding(0, 0, 0, 0);
        view.setInitialScale(100);
        if (Build.VERSION.SDK_INT >= 20) {
            view.setOnApplyWindowInsetsListener(new View.OnApplyWindowInsetsListener() {
                @Override
                public WindowInsets onApplyWindowInsets(View v, WindowInsets insets) {
                    pushInsetsToWeb();
                    return insets;
                }
            });
            view.requestApplyInsets();
        }
        pushInsetsToWeb();
    }

    private int[] measureInsetPx() {
        int left = 0;
        int top = 0;
        int right = 0;
        int bottom = 0;
        int sbId = getResources().getIdentifier("status_bar_height", "dimen", "android");
        if (sbId > 0) {
            top = getResources().getDimensionPixelSize(sbId);
        }
        try {
            if (Build.VERSION.SDK_INT >= 30) {
                android.view.WindowMetrics metrics = getWindowManager().getCurrentWindowMetrics();
                android.graphics.Insets bars = metrics.getWindowInsets().getInsetsIgnoringVisibility(
                        WindowInsets.Type.systemBars() | WindowInsets.Type.displayCutout());
                left = Math.max(left, bars.left);
                top = Math.max(top, bars.top);
                right = Math.max(right, bars.right);
                bottom = Math.max(bottom, bars.bottom);
            } else {
                WindowInsets wi = getWindow().getDecorView().getRootWindowInsets();
                if (wi != null) {
                    left = Math.max(left, wi.getSystemWindowInsetLeft());
                    top = Math.max(top, wi.getSystemWindowInsetTop());
                    right = Math.max(right, wi.getSystemWindowInsetRight());
                    bottom = Math.max(bottom, wi.getSystemWindowInsetBottom());
                    if (Build.VERSION.SDK_INT >= 28 && wi.getDisplayCutout() != null) {
                        top = Math.max(top, wi.getDisplayCutout().getSafeInsetTop());
                        left = Math.max(left, wi.getDisplayCutout().getSafeInsetLeft());
                        right = Math.max(right, wi.getDisplayCutout().getSafeInsetRight());
                        bottom = Math.max(bottom, wi.getDisplayCutout().getSafeInsetBottom());
                    }
                }
            }
        } catch (Exception ignored) {
            // fall through to resource / minimum
        }
        float density = getResources().getDisplayMetrics().density;
        int minTop = Math.round(Math.max(density, 1f) * 24f);
        if (top < minTop) top = minTop;
        return new int[] { left, top, right, bottom };
    }

    private float[] insetsCssPx() {
        float density = getResources().getDisplayMetrics().density;
        if (density <= 0f) density = 3f;
        int[] px = measureInsetPx();
        return new float[] {
            px[0] / density,
            px[1] / density,
            px[2] / density,
            px[3] / density
        };
    }

    private String fmt(float value) {
        return String.format(java.util.Locale.US, "%.1f", value);
    }

    String insetsCssJson() {
        float[] i = insetsCssPx();
        return "{\"left\":" + fmt(i[0])
                + ",\"top\":" + fmt(i[1])
                + ",\"right\":" + fmt(i[2])
                + ",\"bottom\":" + fmt(i[3]) + "}";
    }

    private String insetsStyleTag() {
        float[] i = insetsCssPx();
        return "<style id=\"flyway-insets\">:root{--flyway-inset-top:"
                + fmt(i[1]) + "px;--flyway-inset-bottom:"
                + fmt(i[3]) + "px;--flyway-inset-left:"
                + fmt(i[0]) + "px;--flyway-inset-right:"
                + fmt(i[2]) + "px;}</style>";
    }

    private void pushInsetsToWeb() {
        if (webView == null) return;
        final String json = insetsCssJson();
        final float[] i = insetsCssPx();
        final String js =
                "window.__FLYWAY_INSETS__=" + json + ";"
                + "(function(t,b,l,r){"
                + "var rEl=document.documentElement;if(!rEl||!rEl.style)return;"
                + "rEl.style.setProperty('--flyway-inset-top',t+'px');"
                + "rEl.style.setProperty('--flyway-inset-bottom',b+'px');"
                + "rEl.style.setProperty('--flyway-inset-left',l+'px');"
                + "rEl.style.setProperty('--flyway-inset-right',r+'px');"
                + "if(window.__FLYWAY_APPLY_INSETS__)window.__FLYWAY_APPLY_INSETS__(t,b,l,r);"
                + "})(" + fmt(i[1]) + "," + fmt(i[3]) + "," + fmt(i[0]) + "," + fmt(i[2]) + ");";
        webView.post(new Runnable() {
            @Override
            public void run() {
                if (Build.VERSION.SDK_INT >= 19) {
                    webView.evaluateJavascript(js, null);
                } else {
                    webView.loadUrl("javascript:" + js);
                }
            }
        });
    }

    @Override
    public void onWindowFocusChanged(boolean hasFocus) {
        super.onWindowFocusChanged(hasFocus);
        if (hasFocus) pushInsetsToWeb();
    }

    @Override
    public void onConfigurationChanged(Configuration newConfig) {
        super.onConfigurationChanged(newConfig);
        if (webView != null) {
            webView.post(new Runnable() {
                @Override
                public void run() {
                    pushInsetsToWeb();
                }
            });
        }
    }

    private class ChromeBridge {
        @JavascriptInterface
        public String insets() {
            return insetsCssJson();
        }
    }

    @Override
    public void onRequestPermissionsResult(
            int requestCode, String[] permissions, int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if (requestCode != REQ_LOCATION || pendingGeoCallback == null) return;
        boolean granted = grantResults.length > 0
                && grantResults[0] == PackageManager.PERMISSION_GRANTED;
        pendingGeoCallback.invoke(pendingGeoOrigin, granted, false);
        pendingGeoCallback = null;
        pendingGeoOrigin = null;
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode != REQ_FILE || filePathCallback == null) return;
        Uri[] uris = null;
        if (resultCode == RESULT_OK && Build.VERSION.SDK_INT >= 21) {
            uris = WebChromeClient.FileChooserParams.parseResult(resultCode, data);
        }
        filePathCallback.onReceiveValue(uris);
        filePathCallback = null;
    }

    @Override
    protected void onPause() {
        CookieManager.getInstance().flush();
        super.onPause();
    }

    @Override
    public void onBackPressed() {
        if (webView != null && webView.canGoBack()) {
            webView.goBack();
            return;
        }
        super.onBackPressed();
    }
}
