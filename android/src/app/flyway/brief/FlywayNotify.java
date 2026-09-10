package app.flyway.brief;

import android.app.Activity;
import android.app.AlarmManager;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.os.Build;
import android.os.SystemClock;
import android.webkit.JavascriptInterface;

import org.json.JSONObject;

public class FlywayNotify {
    static final String PREFS = "flyway_watch";
    static final String KEY_CONFIG = "config";
    static final String KEY_LAST_ALERT = "lastAlertAt";
    static final String KEY_LAST_LEVEL = "lastLevel";
    static final String CHANNEL = "flyway_push";
    static final int ALARM_REQ = 77;
    static final int NOTIFY_ID = 42;
    static final long INTERVAL_MS = 2L * 60L * 60L * 1000L;
    static final long COOLDOWN_MS = 8L * 60L * 60L * 1000L;

    private final Activity activity;

    public FlywayNotify(Activity activity) {
        this.activity = activity;
        ensureChannel(activity);
    }

    @JavascriptInterface
    public void enableWatch(String json) {
        SharedPreferences prefs = activity.getSharedPreferences(PREFS, Context.MODE_PRIVATE);
        prefs.edit().putString(KEY_CONFIG, json == null ? "" : json).commit();
        schedule(activity);
        if (Build.VERSION.SDK_INT >= 33
                && activity.checkSelfPermission("android.permission.POST_NOTIFICATIONS")
                    != PackageManager.PERMISSION_GRANTED) {
            activity.runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    activity.requestPermissions(
                            new String[] {"android.permission.POST_NOTIFICATIONS"},
                            71);
                }
            });
        }
        new Thread(new Runnable() {
            @Override
            public void run() {
                PushCheckReceiver.check(activity);
            }
        }).start();
    }

    @JavascriptInterface
    public void disableWatch() {
        activity.getSharedPreferences(PREFS, Context.MODE_PRIVATE).edit().remove(KEY_CONFIG).commit();
        cancel(activity);
    }

    @JavascriptInterface
    public void notifyNow(String title, String body) {
        show(activity, title, body);
    }

    @JavascriptInterface
    public void markAlerted(String level) {
        activity.getSharedPreferences(PREFS, Context.MODE_PRIVATE)
                .edit()
                .putLong(KEY_LAST_ALERT, System.currentTimeMillis())
                .putString(KEY_LAST_LEVEL, level == null ? "" : level)
                .commit();
    }

    static boolean watching(Context context) {
        String config = context.getSharedPreferences(PREFS, Context.MODE_PRIVATE).getString(KEY_CONFIG, "");
        return config != null && config.length() > 8;
    }

    static JSONObject config(Context context) {
        try {
            String raw = context.getSharedPreferences(PREFS, Context.MODE_PRIVATE).getString(KEY_CONFIG, "");
            if (raw == null || raw.length() < 8) return null;
            return new JSONObject(raw);
        } catch (Exception e) {
            return null;
        }
    }

    static void schedule(Context context) {
        AlarmManager am = (AlarmManager) context.getSystemService(Context.ALARM_SERVICE);
        if (am == null) return;
        PendingIntent pi = alarmIntent(context);
        am.setInexactRepeating(
                AlarmManager.ELAPSED_REALTIME_WAKEUP,
                SystemClock.elapsedRealtime() + 15L * 60L * 1000L,
                INTERVAL_MS,
                pi);
    }

    static void cancel(Context context) {
        AlarmManager am = (AlarmManager) context.getSystemService(Context.ALARM_SERVICE);
        if (am == null) return;
        am.cancel(alarmIntent(context));
    }

    static PendingIntent alarmIntent(Context context) {
        Intent intent = new Intent(context, PushCheckReceiver.class);
        int flags = PendingIntent.FLAG_UPDATE_CURRENT;
        if (Build.VERSION.SDK_INT >= 23) flags |= PendingIntent.FLAG_IMMUTABLE;
        return PendingIntent.getBroadcast(context, ALARM_REQ, intent, flags);
    }

    static void ensureChannel(Context context) {
        if (Build.VERSION.SDK_INT < 26) return;
        NotificationManager nm = (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
        if (nm == null) return;
        NotificationChannel channel = new NotificationChannel(
                CHANNEL,
                "Flyway push alerts",
                NotificationManager.IMPORTANCE_HIGH);
        channel.setDescription("When weather north of you is moving new birds");
        nm.createNotificationChannel(channel);
    }

    static void show(Context context, String title, String body) {
        ensureChannel(context);
        Intent open = new Intent(context, MainActivity.class);
        open.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);
        int flags = PendingIntent.FLAG_UPDATE_CURRENT;
        if (Build.VERSION.SDK_INT >= 23) flags |= PendingIntent.FLAG_IMMUTABLE;
        PendingIntent tap = PendingIntent.getActivity(context, 0, open, flags);

        android.app.Notification.Builder builder;
        if (Build.VERSION.SDK_INT >= 26) {
            builder = new android.app.Notification.Builder(context, CHANNEL);
        } else {
            builder = new android.app.Notification.Builder(context);
        }
        builder.setSmallIcon(R.drawable.ic_notify)
                .setContentTitle(title == null ? "Flyway" : title)
                .setContentText(body == null ? "" : body)
                .setStyle(new android.app.Notification.BigTextStyle().bigText(body))
                .setAutoCancel(true)
                .setContentIntent(tap);
        if (Build.VERSION.SDK_INT >= 21) {
            builder.setColor(0xFF9AADA0);
        }
        NotificationManager nm = (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
        if (nm != null) nm.notify(NOTIFY_ID, builder.build());
    }
}
