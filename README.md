# Baille

Crie músicas em minutos, com modelos prontos e instrumentos de verdade, e mostre pra comunidade.

O app roda no navegador do celular e pode ser **instalado na tela inicial** (Android e iPhone).
No Android ele também vira um **APK** que pode ser baixado pela página de *Releases* deste repositório.

---

## 1. Colocar no GitHub

1. Crie uma conta em [github.com](https://github.com) (se ainda não tiver).
2. Clique em **New repository**, dê o nome `baille`, deixe **Public** e clique em **Create repository**.
3. Na página do repositório, clique em **uploading an existing file**.
4. Descompacte o arquivo `baille-app.zip` no computador e **arraste todo o conteúdo da pasta** (inclusive a pasta `.github`) para a página.
   - Dica: se a pasta `.github` não aparecer, ative "mostrar arquivos ocultos" no computador.
5. Clique em **Commit changes**.

## 2. Publicar o app (link para abrir no celular)

1. No repositório, vá em **Settings → Pages**.
2. Em *Source* escolha **Deploy from a branch**.
3. Em *Branch* escolha **main** e a pasta **/docs**, e clique em **Save**.
4. Depois de 1 ou 2 minutos o endereço aparece no topo da página, algo como
   `https://SEU-USUARIO.github.io/baille/`

### Instalar pelo link
- **Android (Chrome):** abra o link → menu ⋮ → **Instalar app** (ou *Adicionar à tela inicial*).
- **iPhone (Safari):** abra o link → botão Compartilhar → **Adicionar à Tela de Início**.

O ícone do Baille aparece junto com os outros apps e abre em tela cheia.

## 3. Baixar o APK (Android)

Sempre que algo é enviado para o repositório, o GitHub gera o APK sozinho
(veja o andamento na aba **Actions** — leva uns 5 minutos).

1. Abra a aba **Releases** do repositório pelo celular.
2. Toque em **Baille.apk** para baixar.
3. Abra o arquivo e toque em **Instalar** (se pedir, permita instalar apps desta fonte).

> O APK é uma versão de teste (assinada em modo *debug*). Para publicar na Google Play
> é preciso gerar uma versão assinada com a sua chave — dá para fazer depois.

## Testar no computador

```bash
npm run dev
# abra http://localhost:8080
```

## Estrutura

| Pasta / arquivo | O que é |
| --- | --- |
| `docs/` | O app (é isso que o GitHub Pages publica) |
| `docs/pages.js` | Todas as telas |
| `docs/core.js` | Dados, armazenamento e motor de áudio |
| `docs/runtime.js` | Mostra as telas e faz a navegação |
| `docs/assets/sons/` | Amostras de instrumentos reais |
| `docs/assets/img/` | Capas, fundos e logo |
| `capacitor.config.json` | Configuração do app Android |
| `.github/workflows/android.yml` | Gera o APK automaticamente |

Os dados (perfil, rascunhos, músicas publicadas) ficam guardados no próprio celular.

## Créditos dos sons

Veja [CREDITOS.md](CREDITOS.md).
