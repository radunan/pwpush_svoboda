# Nasazení – Severotisk Sdílení tajemství

Průvodce pro nasazení interního nástroje na sdílení hesel a citlivých informací.

---

## Co systém tvoří

Aplikace se skládá ze dvou služeb, které spouštíte dohromady přes Docker Compose:

| Služba | Technologie | Port | Popis |
|--------|-------------|------|-------|
| **pwpush** | Docker (Ruby on Rails) | interní | Backend — ukládá a šifruje tajemství |
| **frontend** | Docker (Next.js) | 3000 | Webové rozhraní pro zaměstnance |

Zaměstnanci přistupují pouze na port 3000. pwpush není exponován ven.

---

## Požadavky na server

- **OS:** Linux (Ubuntu 22.04+ doporučeno)
- **Docker:** verze 20+ včetně Docker Compose (plugin `docker compose`)

Ověření:
```bash
docker --version
docker compose version
```

---

## Nasazení (doporučeno: Docker Compose)

### 1. Zkopírování souborů na server

```bash
git clone <url-repozitare> /opt/pwpush-ui
cd /opt/pwpush-ui
```

nebo přenos přes scp:

```bash
scp -r ./pwpush_severotisk user@server:/opt/pwpush-ui
cd /opt/pwpush-ui
```

---

### 2. Prvotní nastavení pwpush — získání API tokenu

Nejprve spusťte pouze pwpush, abyste mohli vytvořit firemní účet:

```bash
docker compose up pwpush -d
```

Poté:
1. Otevřete `http://adresa-serveru:5100` v prohlížeči
2. Pokud se zobrazí stránka prvního spuštění, dokončete nastavení
3. Zaregistrujte firemní účet (např. `admin@severotisk.cz`)
4. Po přihlášení přejděte na **Profile → API Access**
5. Zkopírujte **API Token**

---

### 3. Konfigurace prostředí

```bash
cp .env.production.example .env.production
nano .env.production
```

Vyplňte skutečné hodnoty:

```env
PWPUSH_EMAIL=admin@severotisk.cz
PWPUSH_TOKEN=zkopirovaný_token_z_pwpush
```

> **Důležité:** `.env.production` nikdy necommitujte do gitu — je v `.gitignore`.

---

### 4. Spuštění celého stacku

```bash
docker compose up -d
```

Docker sestaví frontend image a spustí obě služby. První build trvá 1–2 minuty.

Ověření že vše běží:
```bash
docker compose ps
```

---

### 5. Ověření funkčnosti

| URL | Co zkontrolovat |
|-----|-----------------|
| `http://server:3000` | Zobrazí se formulář pro vytvoření push |
| `http://server:3000/health` | Musí zobrazit verzi pwpush |
| `http://server:3000/dashboard` | Zobrazí seznam pushů |

**Test end-to-end:**
1. Vytvořte push na hlavní stránce
2. Zkopírujte odkaz, otevřete v anonymním okně — tajemství by mělo být rozmazané
3. Jděte na Dashboard — push by se měl zobrazit

---

## Nginx — reverzní proxy (doporučeno)

Nginx umožní přistupovat přes port 80 / 443 místo portu 3000.

```bash
apt install nginx -y
nano /etc/nginx/sites-available/pwpush-ui
```

Vložte:

```nginx
server {
    listen 80;
    server_name hesla.severotisk.cz;  # nebo IP adresa serveru

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
ln -s /etc/nginx/sites-available/pwpush-ui /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
```

### HTTPS pomocí Let's Encrypt (volitelné)

```bash
apt install certbot python3-certbot-nginx -y
certbot --nginx -d hesla.severotisk.cz
```

---

## Aktualizace aplikace

```bash
cd /opt/pwpush-ui
git pull
docker compose up -d --build
```

`--build` přestaví frontend image s novým kódem. pwpush kontejner se nedotýká.

---

## Užitečné příkazy

```bash
docker compose ps                    # stav služeb
docker compose logs -f frontend      # logy frontendu v reálném čase
docker compose logs -f pwpush        # logy pwpush
docker compose restart frontend      # restart jen frontendu
docker compose down                  # zastavení všeho
docker compose down -v               # zastavení + smazání dat pwpush (!)
```

---

## Řešení problémů

**Dashboard je prázdný / neukazuje pushe**
→ Zkontrolujte `.env.production` — musí obsahovat správný `PWPUSH_EMAIL` a `PWPUSH_TOKEN`
→ Po změně je nutný rebuild: `docker compose up -d --build`

**Health stránka hlásí chybu připojení**
→ Ověřte že pwpush běží: `docker compose ps`
→ Zkontrolujte logy: `docker compose logs pwpush`

**Chyba při buildu na ARM serveru** (Raspberry Pi apod.)
→ Přidejte do `docker-compose.yml` pod službu `pwpush`:
```yaml
    platform: linux/amd64
```

**Port 3000 je obsazený**
→ Změňte v `docker-compose.yml`: `"3001:3000"` a aktualizujte Nginx

---

## Přehled portů

| Port | Služba | Přístupnost |
|------|--------|-------------|
| 3000 | Next.js frontend | interní (za Nginx) nebo přímý přístup |
| 5100 | pwpush backend | pouze uvnitř Docker sítě |
| 80 / 443 | Nginx | zaměstnanci |
