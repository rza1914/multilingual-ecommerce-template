# Systemd service files for iShop E-commerce Platform

# Backend Service - ishop-backend.service
[Unit]
Description=iShop Backend Service
After=network.target
Wants=network.target

[Service]
Type=simple
User=ishop
Group=ishop
WorkingDirectory=/opt/ishop-backend
EnvironmentFile=/opt/ishop-backend/.env.production
ExecStart=/opt/ishop-backend/venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
ExecReload=/bin/kill -HUP $MAINPID
Restart=always
RestartSec=5
StandardOutput=journal
StandardError=journal
SyslogIdentifier=ishop-backend

# Security settings
NoNewPrivileges=true
PrivateTmp=true
ReadWritePaths=/opt/ishop-backend/uploads /opt/ishop-backend/logs
ReadOnlyPaths=/usr /etc
InaccessiblePaths=/root /sys /proc

# Resource limits
LimitNOFILE=65536
LimitNPROC=65536

[Install]
WantedBy=multi-user.target

# Frontend Service - ishop-frontend.service
[Unit]
Description=iShop Frontend Service
After=network.target
Wants=network.target
Requires=ishop-backend.service

[Service]
Type=simple
User=ishop
Group=ishop
WorkingDirectory=/opt/ishop-frontend
ExecStart=/usr/bin/npm run start:prod
ExecReload=/bin/kill -HUP $MAINPID
Restart=always
RestartSec=5
StandardOutput=journal
StandardError=journal
SyslogIdentifier=ishop-frontend

# Security settings
NoNewPrivileges=true
PrivateTmp=true
ReadOnlyPaths=/usr /etc

# Resource limits
LimitNOFILE=65536
LimitNPROC=65536

[Install]
WantedBy=multi-user.target

# Nginx Service - ishop-nginx.service (extends system nginx)
[Unit]
Description=iShop Nginx Reverse Proxy
After=network.target
Wants=network.target
Requires=ishop-backend.service ishop-frontend.service

[Service]
Type=oneshot
ExecStart=/bin/systemctl start nginx
ExecStop=/bin/systemctl stop nginx
ExecReload=/bin/systemctl reload nginx
RemainAfterExit=yes

[Install]
WantedBy=multi-user.target

# Backup Service - ishop-backup.timer and ishop-backup.service
# Service file: ishop-backup.service
[Unit]
Description=Daily iShop Database Backup
Requires=ishop-db.service

[Service]
Type=oneshot
User=ishop-backup
Group=ishop-backup
ExecStart=/opt/ishop-backend/scripts/backup.sh
StandardOutput=journal
StandardError=journal
SyslogIdentifier=ishop-backup

[Install]
WantedBy=multi-user.target

# Timer file: ishop-backup.timer
[Unit]
Description=Daily iShop Database Backup Timer
Requires=ishop-backup.service

[Timer]
OnCalendar=daily
Persistent=true
AccuracySec=1min

[Install]
WantedBy=timers.target

# Monitoring Service - ishop-monitoring.service
[Unit]
Description=iShop Application Monitoring
After=network.target
Wants=network.target

[Service]
Type=simple
User=ishop-monitor
Group=ishop-monitor
WorkingDirectory=/opt/ishop-monitoring
ExecStart=/usr/bin/python3 /opt/ishop-monitoring/monitor.py
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal
SyslogIdentifier=ishop-monitor

[Install]
WantedBy=multi-user.target