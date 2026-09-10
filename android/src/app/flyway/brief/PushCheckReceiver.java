package app.flyway.brief;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Calendar;
import java.util.Locale;

public class PushCheckReceiver extends BroadcastReceiver {
    @Override
    public void onReceive(Context context, Intent intent) {
        final PendingResult result = goAsync();
        new Thread(new Runnable() {
            @Override
            public void run() {
                try {
                    check(context);
                } finally {
                    result.finish();
                }
            }
        }).start();
    }

    static void check(Context context) {
        JSONObject config = FlywayNotify.config(context);
        if (config == null) return;
        JSONArray stations = config.optJSONArray("stations");
        if (stations == null || stations.length() == 0) return;

        StringBuilder lats = new StringBuilder();
        StringBuilder lons = new StringBuilder();
        for (int i = 0; i < stations.length(); i++) {
            JSONObject s = stations.optJSONObject(i);
            if (s == null) continue;
            if (lats.length() > 0) {
                lats.append(",");
                lons.append(",");
            }
            lats.append(s.optDouble("lat"));
            lons.append(s.optDouble("lon"));
        }
        if (lats.length() == 0) return;

        String url =
                "https://api.open-meteo.com/v1/forecast?latitude="
                        + lats
                        + "&longitude="
                        + lons
                        + "&current=temperature_2m,pressure_msl,wind_speed_10m,wind_direction_10m"
                        + "&hourly=pressure_msl"
                        + "&timezone=auto&forecast_days=1&past_days=1"
                        + "&temperature_unit=fahrenheit&wind_speed_unit=mph";
        String body;
        try {
            body = fetch(url);
        } catch (Exception e) {
            return;
        }

        JSONArray rows;
        try {
            Object parsed = new org.json.JSONTokener(body).nextValue();
            if (parsed instanceof JSONArray) {
                rows = (JSONArray) parsed;
            } else if (parsed instanceof JSONObject) {
                rows = new JSONArray();
                rows.put(parsed);
            } else {
                return;
            }
        } catch (Exception e) {
            return;
        }

        int freeze = 0;
        int north = 0;
        int falling = 0;
        double coldest = 99;
        String northName = "";
        double northTemp = 0;
        String northWind = "";
        Calendar cal = Calendar.getInstance();
        int doy = cal.get(Calendar.DAY_OF_YEAR);
        boolean fall = doy >= 213 || doy < 50;

        for (int i = 0; i < rows.length(); i++) {
            JSONObject row = rows.optJSONObject(i);
            if (row == null) continue;
            JSONObject current = row.optJSONObject("current");
            if (current == null) continue;
            double temp = current.optDouble("temperature_2m", 50);
            double dir = current.optDouble("wind_direction_10m", 0);
            double change = pressureChange(row, current);
            if (temp <= 32) freeze += 1;
            if (fall ? isNortherly(dir) : isSoutherly(dir)) north += 1;
            if (change <= -4) falling += 1;
            if (temp < coldest) coldest = temp;
            if (i == 0) {
                JSONObject station = stations.optJSONObject(0);
                northName = station != null ? station.optString("name", "Upflyway") : "Upflyway";
                northTemp = temp;
                northWind = cardinal(dir);
            }
        }

        int score = 3;
        if (freeze >= 2) score += 5;
        else if (freeze == 1) score += 3;
        if (north >= 2) score += 3;
        if (falling >= 1) score += 2;
        if (coldest <= 20) score += 2;
        if (score > 12) score = 12;
        if (score < 8) return;

        String level = score >= 11 ? "exodus" : "push";
        SharedPreferences prefs = context.getSharedPreferences(FlywayNotify.PREFS, Context.MODE_PRIVATE);
        long last = prefs.getLong(FlywayNotify.KEY_LAST_ALERT, 0);
        String lastLevel = prefs.getString(FlywayNotify.KEY_LAST_LEVEL, "");
        boolean upgrade = "exodus".equals(level) && !"exodus".equals(lastLevel);
        if (!upgrade && System.currentTimeMillis() - last < FlywayNotify.COOLDOWN_MS) return;

        String place = config.optString("name", "your marsh");
        String title =
                "exodus".equals(level)
                        ? ("Hard push toward " + place)
                        : ("Birds moving toward " + place);
        String detail =
                String.format(
                        Locale.US,
                        "%s is %.0f° with %s wind. Freeze stations: %d. Following wind: %d.",
                        northName,
                        northTemp,
                        northWind,
                        freeze,
                        north);
        FlywayNotify.show(context, title, detail);
        prefs.edit()
                .putLong(FlywayNotify.KEY_LAST_ALERT, System.currentTimeMillis())
                .putString(FlywayNotify.KEY_LAST_LEVEL, level)
                .commit();
    }

    private static double pressureChange(JSONObject row, JSONObject current) {
        try {
            JSONObject hourly = row.getJSONObject("hourly");
            JSONArray times = hourly.getJSONArray("time");
            JSONArray pressure = hourly.getJSONArray("pressure_msl");
            String now = current.optString("time", "");
            int idx = 0;
            for (int i = 0; i < times.length(); i++) {
                String t = times.optString(i, "");
                if (t.equals(now) || (now.length() >= 13 && t.startsWith(now.substring(0, 13)))) {
                    idx = i;
                    break;
                }
                idx = i;
            }
            int idx24 = Math.max(0, idx - 24);
            return current.optDouble("pressure_msl", 0) - pressure.optDouble(idx24, current.optDouble("pressure_msl", 0));
        } catch (Exception e) {
            return 0;
        }
    }

    private static boolean isNortherly(double deg) {
        double d = ((deg % 360) + 360) % 360;
        return d >= 292.5 || d <= 67.5;
    }

    private static boolean isSoutherly(double deg) {
        double d = ((deg % 360) + 360) % 360;
        return d >= 112.5 && d <= 247.5;
    }

    private static String cardinal(double deg) {
        String[] dirs = {
            "N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE",
            "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"
        };
        int i = (int) Math.round((((deg % 360) + 360) % 360) / 22.5) % 16;
        return dirs[i];
    }

    private static String fetch(String spec) throws Exception {
        HttpURLConnection conn = (HttpURLConnection) new URL(spec).openConnection();
        conn.setConnectTimeout(8000);
        conn.setReadTimeout(10000);
        conn.setRequestProperty("Accept", "application/json");
        InputStream in = conn.getInputStream();
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        byte[] buf = new byte[4096];
        int n;
        while ((n = in.read(buf)) != -1) out.write(buf, 0, n);
        in.close();
        conn.disconnect();
        return new String(out.toByteArray(), "UTF-8");
    }
}
