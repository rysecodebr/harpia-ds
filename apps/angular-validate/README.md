# Angular Validate

Aplicação local exclusiva de validação visual da tipografia do Harpia DS. Não é a vitrine do produto nem um pacote publicável. Usa os tokens CSS gerados no repositório e os arquivos oficiais Montserrat.

Na pasta do projeto:

```powershell
npm ci
npm run build
npm test -- --watch=false
npm start
```

Abra `http://localhost:4200/`. Confira os seis papéis, claro/escuro, largura de 390 px, zoom de 100%/200% e quebra de linha. A aplicação usa Angular 22. A validação de compatibilidade da futura biblioteca com Angular 21 ainda é outra etapa.
