package app.flyway.brief;

import android.Manifest;
import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.graphics.Color;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.view.View;
import android.view.Window;
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
        settings.setLoadWithOverviewMode(true);
        settings.setUseWideViewPort(true);
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
        String tag = "<script>window.__FLYWAY_BOOT__=" + boot + ";</script>";
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
        if (Build.VERSION.SDK_INT >= 21) {
            window.setStatusBarColor(bg);
            window.setNavigationBarColor(bg);
        }
        if (Build.VERSION.SDK_INT >= 23) {
            window.getDecorView().setSystemUiVisibility(View.SYSTEM_UI_FLAG_LAYOUT_STABLE);
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
