# Robots.txt Analysis — Principal33 Careers

Sursa: https://www.principal33.com/robots.txt

## Reguli

```
# START YOAST BLOCK
# ---------------------------
User-agent: *
Disallow:

Sitemap: https://www.principal33.com/sitemap_index.xml
# ---------------------------
# END YOAST BLOCK
```

## Interpretare

| Cale | Accesibil? | Ce conține |
|---|---|---|
| Tot site-ul | ✅ Da | Nicio restricție — toate resursele sunt permise |
| `https://principal33.jobs.personio.de/search.json` | ✅ Da | API-ul Personio JSON de unde scraperul extrage datele (domeniu separat, neacoperit de robots.txt) |

## Recomandare

robots.txt permite accesul total tuturor user-agent-elor. Nu există restricții de scraping. Scraperul nostru:

- Folosește API-ul Personio JSON (`search.json`) — un endpoint public care nu necesită autentificare
- Se identifică prin User-Agent: `job_seeker_ro_spider`
- Face o singură cerere la API (toate job-urile sunt returnate într-un singur răspuns)
- Nu face cereri multiple sau paralel — comportament extrem de politicos

**Concluzie**: Fără risc. robots.txt permite totul, API-ul e public, scraperul e politicos.
