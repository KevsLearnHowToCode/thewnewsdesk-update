/**
 * pm2 ecosystem config — The NewsDesk API + Next.js websites
 *
 * Usage:
 *   pm2 start ecosystem.config.js --env production
 *   pm2 reload ecosystem.config.js --env production   # zero-downtime reload
 *   pm2 save                                          # persist process list
 *   pm2 startup                                       # generate systemd unit
 *
 * Env vars are loaded by each app from its own .env file via dotenv.
 * Only NODE_ENV and PORT need to be set here.
 */

module.exports = {
  apps: [
    // ── CMS API (Express 4, port 4000) ──────────────────────────────────────
    {
      name:    'thenewsdesk-api',
      script:  'server/index.js',
      cwd:     '/var/www/thenewsdesk',
      // Single instance — upgrade to cluster mode only after load testing
      exec_mode:  'fork',
      instances:  1,
      autorestart: true,
      watch:       false,
      // Restart if process exceeds 512 MB RSS
      max_memory_restart: '512M',
      // Grace period before pm2 counts an exit as a crash
      min_uptime: '10s',
      // Max consecutive restarts within min_uptime before marking as errored
      max_restarts: 10,
      // Exponential backoff on crash restart (100 ms → up to ~3 min)
      exp_backoff_restart_delay: 100,
      // How long pm2 waits for the process to signal 'ready' or become online
      listen_timeout: 5000,
      // Grace period for SIGTERM before pm2 sends SIGKILL
      kill_timeout: 5000,
      // Merge stdout/stderr into one file per log type (not per restart)
      merge_logs: false,
      env: {
        NODE_ENV: 'development',
        PORT:     4000,
      },
      env_production: {
        NODE_ENV: 'production',
        PORT:     4000,
      },
      error_file:      '/var/log/thenewsdesk/api-err.log',
      out_file:        '/var/log/thenewsdesk/api-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    },

    // ── OpinYon website (Next.js, port 3001) ────────────────────────────────
    {
      name:    'website-opinyon',
      script:  'node_modules/.bin/next',
      args:    'start --port 3001',
      cwd:     '/var/www/website-opinyon',
      exec_mode:  'fork',
      instances:  1,
      autorestart: true,
      watch:       false,
      max_memory_restart: '512M',
      min_uptime:   '10s',
      max_restarts: 10,
      exp_backoff_restart_delay: 100,
      listen_timeout: 8000,   // Next.js startup can be slow
      kill_timeout:   5000,
      merge_logs: false,
      env_production: {
        NODE_ENV: 'production',
      },
      error_file:      '/var/log/thenewsdesk/opinyon-err.log',
      out_file:        '/var/log/thenewsdesk/opinyon-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    },

  ],
};
