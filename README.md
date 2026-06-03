# Vyracare App User MFE

Micro-frontend da plataforma Vyracare responsavel pelos fluxos de cadastro e consulta de pacientes.

## Objetivo

O `vyracare-app-user-mfe` concentra a experiencia de gestao de pacientes dentro do ecossistema federado do shell.

## Integracao com o shell

O shell espera:

- um `remoteEntry.js` publicado pelo MFE;
- uma rota principal exposta por `./Routes`;
- compatibilidade de versoes Angular e do `@vyracare/design-system`.

Em desenvolvimento local, o remoto roda na porta configurada pelo projeto e pode ser carregado pelo shell por meio do `environment.dev.ts`.

## Execucao local

```bash
npm install
npm start
```

## Testes

```bash
npm test
```

## Convencao de commits

Os commits deste repositorio devem ser escritos em portugues.

Padrao recomendado:

- `feat: adiciona formulario de cadastro de paciente`
- `fix: corrige validacao de email no fluxo de cadastro`
- `docs: atualiza explicacao do mfe de pacientes`
