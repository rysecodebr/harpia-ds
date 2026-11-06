# Angular Validate

Aplicação local exclusiva de validação visual da tipografia do Harpia DS. Não é a vitrine do produto nem um pacote publicável. Usa os tokens CSS gerados no repositório e os arquivos oficiais Montserrat. Exibe os seis papéis em contexto e tabelas com 12 tamanhos, 5 pesos, 6 alturas de linha e 6 papéis aprovados. Os dados das tabelas vêm de `tokens/typography.json` por `tools/sync-validate.mjs`. Uma cena local compara os tokens aprovados de backdrop e sombra nos dois temas; os números de camada permanecem locais à prova.

Na pasta do projeto:

```powershell
npm ci
npm run build
npm test -- --watch=false
npm start
npm run test:zoom
```

Abra `http://localhost:4200/`. O teste `test:zoom` requer o servidor ativo e Google Chrome instalado; use `HARPIA_CHROME_PATH` para outro caminho e `HARPIA_VALIDATE_URL` para outra URL. Ele abre perfis descartáveis com zoom real do Chrome em 100% e 200%, verifica as 29 amostras, Montserrat, largura útil e overflow, e grava capturas em `artifacts/zoom/`. A aplicação usa Angular 22. A validação de compatibilidade da futura biblioteca com Angular 21 ainda é outra etapa.
