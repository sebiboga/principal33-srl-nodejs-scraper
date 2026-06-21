# Contributing

Thank you for your interest in contributing!

## 🌱 This Repo Is a Derived Scraper

Acest scraper este derivat din [epam-systems-international-srl-nodejs-scraper](https://github.com/sebiboga/epam-systems-international-srl-nodejs-scraper), template-ul de referință pentru scrapere Node.js din ecosistemul peviitor.ro.

Pentru a deriva un scraper nou pentru o altă companie românească, urmează instrucțiunile din [AI-DERIVATION-GUIDE.md](AI-DERIVATION-GUIDE.md) din template-ul EPAM original.

## Development

### Prerequisites
- Node.js 24+
- npm

### Setup
```bash
git clone https://github.com/sebiboga/principal33-srl-nodejs-scraper.git
cd principal33-srl-nodejs-scraper
npm install
```

### Testing
```bash
# All tests
npm test

# Unit tests only
npm run test:unit

# Integration tests
npm run test:integration

# E2E tests
npm run test:e2e
```

### Configuration
All company-specific configuration is in `config/company.json`.
