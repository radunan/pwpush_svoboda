# PwPush Frontend

Vlastní Next.js frontend pro [Password Pusher (pwpush)](https://github.com/pglombardo/PasswordPusher) OSS instanci.

## Stack

- **Next.js 14** (App Router, TypeScript)
- **Tailwind CSS v3** + vlastní shadcn/ui komponenty
- **Sonner** — toast notifikace
- **react-dropzone** — drag & drop nahrávání souborů

## Předpoklady

- Node.js 18+ a npm
- Docker (pro spuštění pwpush)

---

## 1. Spuštění pwpush serveru

```bash
docker run -d -p 5100:5100 --name pwpush pglombardo/pwpush:latest
```

Server bude dostupný na `http://localhost:5100`.

---

## 2. Získání API tokenu

1. Otevřete `http://localhost:5100` v prohlížeči
2. Zaregistrujte se nebo přihlaste
3. Přejděte do **Account → API Token**
4. Zkopírujte token

---

## 3. Konfigurace prostředí

```bash
cp .env.example .env.local
```

Upravte `.env.local`:

```env
PWPUSH_API_BASE=http://localhost:5100
PWPUSH_API_TOKEN=váš_token_zde
NEXT_PUBLIC_PWPUSH_BASE=http://localhost:5100
```

> **Bezpečnost:** `PWPUSH_API_TOKEN` je čten pouze na serveru (Next.js API routes). Nikdy není
> exponován klientovi. `NEXT_PUBLIC_PWPUSH_BASE` je použit pouze pro přímé download linky k souborům.

---

## 4. Instalace a spuštění

```bash
npm install
npm run dev
```

Aplikace bude dostupná na `http://localhost:3000`.

---

## Stránky

| Cesta                      | Popis                                        |
| -------------------------- | -------------------------------------------- |
| `/`                        | Formulář pro vytvoření nového tajemství      |
| `/s/[token]`               | Zobrazení tajemství příjemcem (s gate flow)  |
| `/dashboard`               | Přehled aktivních a expirovaných pushů       |
| `/dashboard/[token]/audit` | Audit log přístupů                           |
| `/health`                  | Debug stav připojení k pwpush                |

## API Routes (proxy)

Všechna komunikace s pwpush API probíhá přes Next.js route handlers, které injektují API token:

| Route                       | Metoda | Popis                                    |
| --------------------------- | ------ | ---------------------------------------- |
| `/api/version`              | GET    | Verze pwpush                             |
| `/api/pushes`               | POST   | Vytvoření pushe (JSON i multipart)       |
| `/api/pushes/[token]`       | GET    | Načtení obsahu (+ `?passphrase=`)        |
| `/api/pushes/[token]`       | DELETE | Expirace pushe                           |
| `/api/pushes/[token]/audit` | GET    | Audit log                                |
| `/api/pushes/active`        | GET    | Aktivní pushe                            |
| `/api/pushes/expired`       | GET    | Expirované pushe                         |
# pwpush_svoboda
