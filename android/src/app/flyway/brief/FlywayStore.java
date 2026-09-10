package app.flyway.brief;

import android.content.Context;
import android.content.SharedPreferences;
import android.webkit.JavascriptInterface;

import org.json.JSONObject;

import java.util.Map;

/**
 * Durable key/value store for the WebView. Intercepted https origins often lose
 * localStorage when the process dies; SharedPreferences survive that.
 */
public class FlywayStore {
    private final SharedPreferences prefs;

    public FlywayStore(Context context) {
        prefs = context.getSharedPreferences("flyway_lodge", Context.MODE_PRIVATE);
    }

    @JavascriptInterface
    public String getItem(String key) {
        if (key == null) return "";
        String value = prefs.getString(key, "");
        return value == null ? "" : value;
    }

    @JavascriptInterface
    public void setItem(String key, String value) {
        if (key == null) return;
        prefs.edit().putString(key, value == null ? "" : value).commit();
    }

    @JavascriptInterface
    public void removeItem(String key) {
        if (key == null) return;
        prefs.edit().remove(key).commit();
    }

    public String dumpJson() {
        JSONObject object = new JSONObject();
        Map<String, ?> all = prefs.getAll();
        if (all == null) return "{}";
        for (Map.Entry<String, ?> entry : all.entrySet()) {
            if (entry.getKey() == null || entry.getValue() == null) continue;
            if (entry.getKey().startsWith("flyway-blob-")) continue;
            try {
                object.put(entry.getKey(), String.valueOf(entry.getValue()));
            } catch (Exception ignored) {
                // skip a bad key rather than fail the boot payload
            }
        }
        return object.toString();
    }
}
