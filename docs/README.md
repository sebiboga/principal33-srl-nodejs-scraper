# job_seeker_ro_spider — Principal33 S.R.L.

**job_seeker_ro_spider** — scraper automat pentru locurile de muncă PRINCIPAL33 S.R.L.

Extrage anunțurile de pe [Principal33 Personio Careers](https://principal33.jobs.personio.de) și le publică în [peviitor.ro](https://peviitor.ro) prin API-ul SOLR.

## Cum funcționează

1. **Validează compania** — interoghează API-ul public ANAF ([demoanaf.ro](https://demoanaf.ro)) după CIF-ul Principal33 (42574513) și verifică:
   - Denumirea oficială: PRINCIPAL33 S.R.L.
   - Compania este activă (funcțiune)
2. **Interoghează job-urile existente** — verifică câte job-uri există deja în SOLR pentru acest CIF
3. **Scrape-uiește job-urile** — extrage lista completă de job-uri din API-ul public Personio
4. **Transformă și validează** — normalizează câmpurile pentru SOLR
5. **Upsert în SOLR** — importă/actualizează job-urile în SOLR
6. **Raport** — generează docs/jobs.md cu situația curentă

## Date Company

| Field | Value |
|-------|-------|
| CIF | 42574513 |
| Legal Name | PRINCIPAL33 S.R.L. |
| Brand | principal33 |
| Website | https://www.principal33.com |
| Careers | https://principal33.jobs.personio.de |
| Scraping Method | Personio JSON API |
| Location | Brașov |

## Surse de date

| Sursă | URL | Acces |
|-------|-----|-------|
| Personio API | `https://principal33.jobs.personio.de/search.json` | Public |
| ANAF | `https://demoanaf.ro/api/company/42574513` | Public |
| Peviitor | `https://api.peviitor.ro/v1/company/` | Public |
| SOLR | `https://solr.peviitor.ro/solr/job` | Autentificare |

## Testare

```bash
# Toate testele
npm test

# Doar unit
npm run test:unit

# Doar integrare
npm run test:integration

# Doar E2E (API real Personio + ANAF + SOLR)
npm run test:e2e
```
