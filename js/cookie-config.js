// cookie-config.js
document.addEventListener('DOMContentLoaded', function() {
    // Cookie-Konfiguration für alle Seiten
    if (typeof silktideCookieBannerManager !== 'undefined') {
        silktideCookieBannerManager.updateCookieBannerConfig({
            background: {
                showBackground: true
            },
            cookieIcon: {
                position: "bottomRight"
            },
            cookieTypes: [
                {
                    id: "necessary",
                    name: "Notwendig",
                    description: "<p>Diese Cookies sind für die grundlegende Funktionalität der Website erforderlich und können nicht deaktiviert werden.</p>",
                    required: true,
                    onAccept: function() {
                        console.log('Notwendige Cookies akzeptiert');
                    }
                },
                {
                    id: "analytics",
                    name: "Analytics",
                    description: "<p>Diese Cookies helfen uns, die Website zu verbessern, indem sie nachverfolgen, welche Seiten am beliebtesten sind und wie Besucher sich auf der Website bewegen.</p>",
                    required: false,
                    onAccept: function() {
                        if (typeof gtag !== 'undefined') {
                            gtag('consent', 'update', {
                                analytics_storage: 'granted',
                            });
                        }
                        if (typeof dataLayer !== 'undefined') {
                            dataLayer.push({
                                'event': 'consent_accepted_analytics',
                            });
                        }
                        console.log('Analytics Cookies akzeptiert');
                    },
                    onReject: function() {
                        if (typeof gtag !== 'undefined') {
                            gtag('consent', 'update', {
                                analytics_storage: 'denied',
                            });
                        }
                        console.log('Analytics Cookies abgelehnt');
                    }
                },
                {
                    id: "advertising",
                    name: "Marketing",
                    description: "<p>Diese Cookies bieten zusätzliche Funktionen und Personalisierung, um Ihr Erlebnis zu verbessern. Sie können von uns oder von Partnern gesetzt werden, deren Dienstleistungen wir nutzen.</p>",
                    required: false,
                    onAccept: function() {
                        console.log('Marketing Cookies akzeptiert');
                    },
                    onReject: function() {
                        console.log('Marketing Cookies abgelehnt');
                    }
                }
            ],
            text: {
                banner: {
                    description: "<p>Wir verwenden Cookies auf unserer Website, um Ihre Benutzererfahrung zu verbessern, personalisierte Inhalte bereitzustellen und unseren Traffic zu analysieren. <a href=\"datenschutz.html\" target=\"_blank\">Cookie-Richtlinie.</a></p>",
                    acceptAllButtonText: "Alle akzeptieren",
                    acceptAllButtonAccessibleLabel: "Alle Cookies akzeptieren",
                    rejectNonEssentialButtonText: "Nur notwendige",
                    rejectNonEssentialButtonAccessibleLabel: "Nur notwendige Cookies akzeptieren",
                    preferencesButtonText: "Einstellungen",
                    preferencesButtonAccessibleLabel: "Cookie-Einstellungen öffnen"
                },
                preferences: {
                    title: "Cookie-Einstellungen anpassen",
                    description: "<p>Wir respektieren Ihr Recht auf Privatsphäre. Sie können wählen, ob Sie bestimmte Arten von Cookies zulassen möchten. Ihre Cookie-Einstellungen gelten für unsere gesamte Website.</p>",
                    creditLinkText: "Kostenloses Cookie-Banner",
                    creditLinkAccessibleLabel: "Kostenloses Cookie-Banner von Silktide"
                }
            }
        });
    }
});