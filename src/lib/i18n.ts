export type Locale = 'cs' | 'en' | 'de'
export const LOCALES: Locale[] = ['cs', 'en', 'de']
export const DEFAULT_LOCALE: Locale = 'cs'
export const STORAGE_KEY = 'pwpush-locale'

export function detectLocale(): Locale {
  if (typeof window === 'undefined') return DEFAULT_LOCALE
  try {
    const stored = localStorage.getItem(STORAGE_KEY) as Locale | null
    if (stored && LOCALES.includes(stored)) return stored
  } catch { /* localStorage unavailable */ }
  const lang = navigator.language?.toLowerCase() ?? ''
  if (lang.startsWith('cs') || lang.startsWith('sk')) return 'cs'
  if (lang.startsWith('de')) return 'de'
  return 'en'
}

export function pluralDays(n: number, locale: Locale): string {
  if (locale === 'cs') return n === 1 ? 'den' : 'dní'
  if (locale === 'de') return n === 1 ? 'Tag' : 'Tage'
  return n === 1 ? 'day' : 'days'
}

export function pluralViews(n: number, locale: Locale): string {
  if (locale === 'cs') return 'zobrazení'
  if (locale === 'de') return n === 1 ? 'Aufruf' : 'Aufrufe'
  return n === 1 ? 'view' : 'views'
}

export function formatDate(iso: string | null, locale: Locale): string {
  if (!iso) return '–'
  const localeStr = locale === 'cs' ? 'cs-CZ' : locale === 'de' ? 'de-DE' : 'en-GB'
  return new Date(iso).toLocaleDateString(localeStr, { day: '2-digit', month: '2-digit', year: 'numeric' })
}

export function formatDateTime(iso: string, locale: Locale): string {
  const localeStr = locale === 'cs' ? 'cs-CZ' : locale === 'de' ? 'de-DE' : 'en-GB'
  return new Date(iso).toLocaleString(localeStr, {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  })
}

export interface Translations {
  nav: {
    newPush: string
    dashboard: string
    settings: string
  }
  form: {
    secret: string
    secretPlaceholder: string
    views: string
    days: string
    advanced: string
    retrievalStep: string
    deletable: string
    passphrase: string
    passphrasePlaceholder: string
    note: string
    notePlaceholder: string
    submit: string
    submitting: string
    errorEmpty: string
    errorCreate: string
    errorConnect: string
    generator: {
      toggle: string
      length: string
      uppercase: string
      lowercase: string
      numbers: string
      special: string
      generate: string
      noChars: string
    }
  }
  result: {
    title: string
    subtitle: string
    openLink: string
    copy: string
    copied: string
    showQr: string
    hideQr: string
    expireNote: string
    newPush: string
  }
  secret: {
    title: string
    subtitle: string
    fetchError: string
    fetchErrorHint: string
    wrongPassphrase: string
    passwordProtected: string
    passphrasePlaceholder: string
    passphraseSubmit: string
    secretLabel: string
    copy: string
    copied: string
    clickToReveal: string
    viewsLeftSuffix: string
    expiresInPrefix: string
    delete: string
    deleting: string
    expiredTitle: string
    expiredText: string
    expiredLink: string
  }
  dashboard: {
    title: string
    noCredentials: string
    tabActive: string
    tabExpired: string
    noActive: string
    noExpired: string
    expireConfirm: string
    expire: string
    expiring: string
    colToken: string
    colNote: string
    colViews: string
    colExpires: string
    colActions: string
    expiredStatus: string
    audit: string
  }
  audit: {
    backLink: string
    titlePrefix: string
    noRecords: string
    loadError: string
    colTime: string
    colIp: string
    colReferrer: string
    colUserAgent: string
    colSuccess: string
  }
  settings: {
    title: string
    subtitle: string
    account: string
    configured: string
    missing: string
    email: string
    apiToken: string
    warningTitle: string
    warningText: string
    warningInstruction: string
    warningRebuild: string
    footnote: string
  }
  home: {
    heading: string
    description: string
    step1: string
    step2: string
    step3: string
    securityNote: string
    securityNoteLink: string
  }
}

const cs: Translations = {
  nav: {
    newPush: 'Nový push',
    dashboard: 'Dashboard',
    settings: 'Nastavení',
  },
  form: {
    secret: 'Údaje',
    secretPlaceholder: 'Heslo, API klíč, certifikát, cokoliv citlivého…',
    views: 'Počet zobrazení',
    days: 'Platnost',
    advanced: 'Pokročilé možnosti',
    retrievalStep: 'Vyžadovat klik pro zobrazení',
    deletable: 'Umožnit příjemci smazat',
    passphrase: 'Heslo pro přístup',
    passphrasePlaceholder: 'Volitelné',
    note: 'Poznámka',
    notePlaceholder: 'Jen pro vás',
    submit: 'Vytvořit bezpečný odkaz',
    submitting: 'Vytváření…',
    errorEmpty: 'Zadejte údaje.',
    errorCreate: 'Chyba při vytváření push.',
    errorConnect: 'Nelze se připojit k serveru.',
    generator: {
      toggle: 'Generovat heslo',
      length: 'Délka',
      uppercase: 'Velká písmena (A–Z)',
      lowercase: 'Malá písmena (a–z)',
      numbers: 'Čísla (0–9)',
      special: 'Speciální znaky (!@#…)',
      generate: 'Vygenerovat',
      noChars: 'Vyberte alespoň jeden typ znaků.',
    },
  },
  result: {
    title: 'Odkaz byl vytvořen',
    subtitle: 'Zkopírujte a pošlete příjemci.',
    openLink: 'Otevřít odkaz',
    copy: 'Kopírovat',
    copied: 'Zkopírováno!',
    showQr: 'Zobrazit QR kód',
    hideQr: 'Skrýt QR kód',
    expireNote: 'Po vypršení limitů bude odkaz automaticky smazán.',
    newPush: 'Vytvořit další →',
  },
  secret: {
    title: 'Sdílené údaje',
    subtitle: 'Byl vám sdílen odkaz na citlivé informace.',
    fetchError: 'Nelze načíst údaje',
    fetchErrorHint: 'Zkontrolujte připojení k pwpush instanci.',
    wrongPassphrase: 'Nesprávné heslo nebo přístup odepřen.',
    passwordProtected: 'Chráněno heslem',
    passphrasePlaceholder: 'Zadejte heslo',
    passphraseSubmit: 'OK',
    secretLabel: 'Údaje',
    copy: 'Kopírovat',
    copied: 'Zkopírováno!',
    clickToReveal: 'Klikněte pro zobrazení',
    viewsLeftSuffix: 'zobrazení zbývá',
    expiresInPrefix: 'vyprší za',
    delete: 'Smazat nyní',
    deleting: 'Mazání...',
    expiredTitle: 'Údaje expirovaly',
    expiredText: 'Tento odkaz již není platný nebo byl smazán.',
    expiredLink: 'Vytvořit nový push →',
  },
  dashboard: {
    title: 'Dashboard',
    noCredentials: 'Chybí firemní API token — nastavte PWPUSH_EMAIL a PWPUSH_TOKEN v .env',
    tabActive: 'Aktivní',
    tabExpired: 'Expirované',
    noActive: 'Žádné aktivní pushe.',
    noExpired: 'Žádné expirované pushe.',
    expireConfirm: 'Opravdu chcete tento push expirovat?',
    expire: 'Expirovat',
    expiring: 'Mazání...',
    colToken: 'Token',
    colNote: 'Poznámka',
    colViews: 'Zobrazení',
    colExpires: 'Vyprší',
    colActions: 'Akce',
    expiredStatus: 'expirováno',
    audit: 'Audit',
  },
  audit: {
    backLink: '← Dashboard',
    titlePrefix: 'Audit log – ',
    noRecords: 'Žádné záznamy.',
    loadError: 'Nepodařilo se načíst audit log.',
    colTime: 'Čas',
    colIp: 'IP adresa',
    colReferrer: 'Referrer',
    colUserAgent: 'User agent',
    colSuccess: 'Úspěch',
  },
  settings: {
    title: 'Nastavení',
    subtitle: 'Stav připojení k pwpush instanci.',
    account: 'Firemní účet',
    configured: 'Nakonfigurován',
    missing: 'Chybí',
    email: 'Email',
    apiToken: 'API Token',
    warningTitle: 'Credentials nejsou nastaveny',
    warningText: 'Dashboard nebude zobrazovat vytvořené pushe.',
    warningInstruction: 'Přidejte do .env.production na serveru:',
    warningRebuild: 'Po změně je nutné znovu sestavit aplikaci (docker compose up -d --build).',
    footnote: 'Credentials jsou uloženy bezpečně na serveru v proměnných prostředí — nejsou přístupné z prohlížeče.',
  },
  home: {
    heading: 'Bezpečné sdílení údajů',
    description: 'Vložte heslo, API klíč nebo jiný citlivý text. Vygeneruje se odkaz s expirací — po dosažení limitu je obsah trvale smazán.',
    step1: 'Vložte údaje a nastavte expiraci',
    step2: 'Zkopírujte a pošlete odkaz příjemci',
    step3: 'Po vypršení jsou údaje automaticky smazány',
    securityNote: 'Údaje jsou šifrovány na serveru. Pro správu odkazů zadejte API token v',
    securityNoteLink: 'Nastavení',
  },
}

const en: Translations = {
  nav: {
    newPush: 'New push',
    dashboard: 'Dashboard',
    settings: 'Settings',
  },
  form: {
    secret: 'Secret',
    secretPlaceholder: 'Password, API key, certificate, anything sensitive…',
    views: 'View limit',
    days: 'Expires after',
    advanced: 'Advanced options',
    retrievalStep: 'Require click to reveal',
    deletable: 'Allow recipient to delete',
    passphrase: 'Access passphrase',
    passphrasePlaceholder: 'Optional',
    note: 'Note',
    notePlaceholder: 'For your eyes only',
    submit: 'Create secure link',
    submitting: 'Creating…',
    errorEmpty: 'Please enter the secret text.',
    errorCreate: 'Error creating push.',
    errorConnect: 'Cannot connect to server.',
    generator: {
      toggle: 'Generate password',
      length: 'Length',
      uppercase: 'Uppercase (A–Z)',
      lowercase: 'Lowercase (a–z)',
      numbers: 'Numbers (0–9)',
      special: 'Special characters (!@#…)',
      generate: 'Generate',
      noChars: 'Select at least one character type.',
    },
  },
  result: {
    title: 'Link created',
    subtitle: 'Copy and send it to the recipient.',
    openLink: 'Open link',
    copy: 'Copy',
    copied: 'Copied!',
    showQr: 'Show QR code',
    hideQr: 'Hide QR code',
    expireNote: 'The link will be automatically deleted when limits are reached.',
    newPush: 'Create another →',
  },
  secret: {
    title: 'Shared secret',
    subtitle: 'You have been sent a link to sensitive information.',
    fetchError: 'Cannot load secret',
    fetchErrorHint: 'Check the connection to the pwpush instance.',
    wrongPassphrase: 'Wrong passphrase or access denied.',
    passwordProtected: 'Password protected',
    passphrasePlaceholder: 'Enter passphrase',
    passphraseSubmit: 'OK',
    secretLabel: 'Secret',
    copy: 'Copy',
    copied: 'Copied!',
    clickToReveal: 'Click to reveal',
    viewsLeftSuffix: 'views remaining',
    expiresInPrefix: 'expires in',
    delete: 'Delete now',
    deleting: 'Deleting...',
    expiredTitle: 'Secret expired',
    expiredText: 'This link is no longer valid or has been deleted.',
    expiredLink: 'Create a new push →',
  },
  dashboard: {
    title: 'Dashboard',
    noCredentials: 'Company API token missing — set PWPUSH_EMAIL and PWPUSH_TOKEN in .env',
    tabActive: 'Active',
    tabExpired: 'Expired',
    noActive: 'No active pushes.',
    noExpired: 'No expired pushes.',
    expireConfirm: 'Are you sure you want to expire this push?',
    expire: 'Expire',
    expiring: 'Deleting...',
    colToken: 'Token',
    colNote: 'Note',
    colViews: 'Views',
    colExpires: 'Expires',
    colActions: 'Actions',
    expiredStatus: 'expired',
    audit: 'Audit',
  },
  audit: {
    backLink: '← Dashboard',
    titlePrefix: 'Audit log – ',
    noRecords: 'No records.',
    loadError: 'Failed to load audit log.',
    colTime: 'Time',
    colIp: 'IP address',
    colReferrer: 'Referrer',
    colUserAgent: 'User agent',
    colSuccess: 'Success',
  },
  settings: {
    title: 'Settings',
    subtitle: 'Connection status to the pwpush instance.',
    account: 'Company account',
    configured: 'Configured',
    missing: 'Missing',
    email: 'Email',
    apiToken: 'API Token',
    warningTitle: 'Credentials not set',
    warningText: 'Dashboard will not show created pushes.',
    warningInstruction: 'Add to .env.production on the server:',
    warningRebuild: 'After the change, rebuild the app (docker compose up -d --build).',
    footnote: 'Credentials are stored securely on the server in environment variables — not accessible from the browser.',
  },
  home: {
    heading: 'Secure secret sharing',
    description: 'Paste a password, API key, or any sensitive text. A link with expiration is generated — once the limit is reached, the content is permanently deleted.',
    step1: 'Enter the secret and set expiration',
    step2: 'Copy and send the link to the recipient',
    step3: 'After expiration the secret is automatically deleted',
    securityNote: 'Secrets are encrypted on the server. To manage links, set your API token in',
    securityNoteLink: 'Settings',
  },
}

const de: Translations = {
  nav: {
    newPush: 'Neuer Push',
    dashboard: 'Dashboard',
    settings: 'Einstellungen',
  },
  form: {
    secret: 'Geheimnis',
    secretPlaceholder: 'Passwort, API-Schlüssel, Zertifikat, alles Sensible…',
    views: 'Anzahl Aufrufe',
    days: 'Gültigkeitsdauer',
    advanced: 'Erweiterte Optionen',
    retrievalStep: 'Klick zum Anzeigen erforderlich',
    deletable: 'Empfänger darf löschen',
    passphrase: 'Zugriffspasswort',
    passphrasePlaceholder: 'Optional',
    note: 'Notiz',
    notePlaceholder: 'Nur für Sie',
    submit: 'Sicheren Link erstellen',
    submitting: 'Erstelle…',
    errorEmpty: 'Bitte geben Sie den Geheimtext ein.',
    errorCreate: 'Fehler beim Erstellen des Pushs.',
    errorConnect: 'Verbindung zum Server nicht möglich.',
    generator: {
      toggle: 'Passwort generieren',
      length: 'Länge',
      uppercase: 'Großbuchstaben (A–Z)',
      lowercase: 'Kleinbuchstaben (a–z)',
      numbers: 'Zahlen (0–9)',
      special: 'Sonderzeichen (!@#…)',
      generate: 'Generieren',
      noChars: 'Wählen Sie mindestens einen Zeichentyp aus.',
    },
  },
  result: {
    title: 'Link erstellt',
    subtitle: 'Kopieren und an den Empfänger senden.',
    openLink: 'Link öffnen',
    copy: 'Kopieren',
    copied: 'Kopiert!',
    showQr: 'QR-Code anzeigen',
    hideQr: 'QR-Code verbergen',
    expireNote: 'Der Link wird nach Ablauf der Limits automatisch gelöscht.',
    newPush: 'Weiteren erstellen →',
  },
  secret: {
    title: 'Geteiltes Geheimnis',
    subtitle: 'Sie haben einen Link zu sensiblen Informationen erhalten.',
    fetchError: 'Geheimnis konnte nicht geladen werden',
    fetchErrorHint: 'Überprüfen Sie die Verbindung zur pwpush-Instanz.',
    wrongPassphrase: 'Falsches Passwort oder Zugriff verweigert.',
    passwordProtected: 'Passwortgeschützt',
    passphrasePlaceholder: 'Passwort eingeben',
    passphraseSubmit: 'OK',
    secretLabel: 'Geheimnis',
    copy: 'Kopieren',
    copied: 'Kopiert!',
    clickToReveal: 'Zum Anzeigen klicken',
    viewsLeftSuffix: 'Aufrufe verbleibend',
    expiresInPrefix: 'läuft ab in',
    delete: 'Jetzt löschen',
    deleting: 'Wird gelöscht...',
    expiredTitle: 'Geheimnis abgelaufen',
    expiredText: 'Dieser Link ist nicht mehr gültig oder wurde gelöscht.',
    expiredLink: 'Neuen Push erstellen →',
  },
  dashboard: {
    title: 'Dashboard',
    noCredentials: 'Firmen-API-Token fehlt — PWPUSH_EMAIL und PWPUSH_TOKEN in .env setzen',
    tabActive: 'Aktiv',
    tabExpired: 'Abgelaufen',
    noActive: 'Keine aktiven Pushs.',
    noExpired: 'Keine abgelaufenen Pushs.',
    expireConfirm: 'Möchten Sie diesen Push wirklich ablaufen lassen?',
    expire: 'Ablaufen lassen',
    expiring: 'Wird gelöscht...',
    colToken: 'Token',
    colNote: 'Notiz',
    colViews: 'Aufrufe',
    colExpires: 'Läuft ab',
    colActions: 'Aktionen',
    expiredStatus: 'abgelaufen',
    audit: 'Audit',
  },
  audit: {
    backLink: '← Dashboard',
    titlePrefix: 'Audit-Log – ',
    noRecords: 'Keine Einträge.',
    loadError: 'Audit-Log konnte nicht geladen werden.',
    colTime: 'Zeit',
    colIp: 'IP-Adresse',
    colReferrer: 'Referrer',
    colUserAgent: 'User-Agent',
    colSuccess: 'Erfolg',
  },
  settings: {
    title: 'Einstellungen',
    subtitle: 'Verbindungsstatus zur pwpush-Instanz.',
    account: 'Firmenkonto',
    configured: 'Konfiguriert',
    missing: 'Fehlt',
    email: 'E-Mail',
    apiToken: 'API-Token',
    warningTitle: 'Anmeldedaten nicht gesetzt',
    warningText: 'Das Dashboard zeigt keine erstellten Pushs an.',
    warningInstruction: 'Fügen Sie .env.production auf dem Server hinzu:',
    warningRebuild: 'Nach der Änderung muss die App neu erstellt werden (docker compose up -d --build).',
    footnote: 'Anmeldedaten werden sicher auf dem Server in Umgebungsvariablen gespeichert — nicht im Browser zugänglich.',
  },
  home: {
    heading: 'Sichere Geheimnisübertragung',
    description: 'Fügen Sie ein Passwort, einen API-Schlüssel oder sensiblen Text ein. Es wird ein Link mit Ablaufdatum generiert — nach dem Limit wird der Inhalt dauerhaft gelöscht.',
    step1: 'Geheimnis eingeben und Ablauf festlegen',
    step2: 'Link kopieren und an den Empfänger senden',
    step3: 'Nach Ablauf wird das Geheimnis automatisch gelöscht',
    securityNote: 'Geheimnisse werden serverseitig verschlüsselt. Zum Verwalten von Links geben Sie Ihr API-Token in den',
    securityNoteLink: 'Einstellungen',
  },
}

export const translations: Record<Locale, Translations> = { cs, en, de }
