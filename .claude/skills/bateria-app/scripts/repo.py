#!/usr/bin/env python3
"""Trabalha no repositório do app Estudo de bateria sem expor o token.

Uso:
  python3 repo.py token 'github_pat_...'   guarda o token em /tmp/.ghtok (permissão 600)
  python3 repo.py clonar [pasta]           clona ou atualiza (padrão: /home/claude/Bateria)
  python3 repo.py publicar "mensagem"      valida, monta, commit, pull --rebase, push e acompanha o deploy
  python3 repo.py status                   mostra as últimas execuções do workflow
"""
import json, os, subprocess, sys, time, urllib.request

REPO = 'francwrlanh19-ai/Bateria'
SITE = 'https://francwrlanh19-ai.github.io/Bateria/'
PASTA = '/home/claude/Bateria'
ARQ_TOKEN = '/tmp/.ghtok'


def ler_token():
    if not os.path.exists(ARQ_TOKEN):
        sys.exit('Sem token. Peça ao usuário um token fine-grained (Contents e Workflows: leitura e escrita; '
                 'Actions: leitura) e rode: python3 repo.py token \'TOKEN\'')
    return open(ARQ_TOKEN).read().strip()


def mascarar(texto, token):
    return texto.replace(token, '***') if token else texto


def rodar(cmd, cwd=None, token=None, checar=True):
    r = subprocess.run(cmd, cwd=cwd, capture_output=True, text=True)
    saida = mascarar((r.stdout or '') + (r.stderr or ''), token).strip()
    if saida:
        print(saida)
    if checar and r.returncode != 0:
        sys.exit(f'Falhou: {mascarar(" ".join(cmd), token)}')
    return r


def url_git(token):
    return f'https://x-access-token:{token}@github.com/{REPO}.git'


def api(caminho, token):
    req = urllib.request.Request(f'https://api.github.com/repos/{REPO}{caminho}',
                                 headers={'Authorization': f'Bearer {token}', 'Accept': 'application/vnd.github+json'})
    with urllib.request.urlopen(req, timeout=30) as resp:
        return json.load(resp)


def cmd_token(valor):
    os.umask(0o077)
    with open(ARQ_TOKEN, 'w') as f:
        f.write(valor.strip())
    try:
        info = json.load(urllib.request.urlopen(urllib.request.Request(
            f'https://api.github.com/repos/{REPO}',
            headers={'Authorization': f'Bearer {valor.strip()}', 'Accept': 'application/vnd.github+json'}), timeout=30))
        p = info.get('permissions', {})
        print(f'Token guardado. Acesso a {info["full_name"]}: push={p.get("push")}')
    except Exception as e:
        print(f'Token guardado, mas não consegui confirmar o acesso ao repositório ({e}).')


def cmd_clonar(pasta=PASTA):
    token = ler_token()
    if os.path.isdir(os.path.join(pasta, '.git')):
        rodar(['git', 'pull', '--rebase', url_git(token), 'main'], cwd=pasta, token=token)
    else:
        rodar(['git', 'clone', url_git(token), pasta], token=token)
        rodar(['git', 'remote', 'set-url', 'origin', f'https://github.com/{REPO}.git'], cwd=pasta)
    rodar(['git', 'config', 'user.name', 'Claude (para francwrlanh19-ai)'], cwd=pasta)
    rodar(['git', 'config', 'user.email', 'noreply@anthropic.com'], cwd=pasta)
    print(f'Repositório pronto em {pasta}')


def cmd_status(token=None, n=3):
    token = token or ler_token()
    for r in api(f'/actions/runs?per_page={n}', token).get('workflow_runs', []):
        print(f"{r['name']} | {r['head_sha'][:7]} | {r['status']} | {r['conclusion']} | {r['html_url']}")


def cmd_publicar(mensagem, pasta=PASTA):
    token = ler_token()
    if not os.path.isdir(os.path.join(pasta, '.git')):
        cmd_clonar(pasta)
    rodar(['node', 'scripts/montar.mjs'], cwd=pasta)          # valida e monta; para se houver erro
    rodar(['git', 'add', '-A'], cwd=pasta)
    if subprocess.run(['git', 'diff', '--cached', '--quiet'], cwd=pasta).returncode == 0:
        print('Nada mudou desde o último envio; não há o que publicar.')
        return
    rodar(['git', 'commit', '-m', mensagem], cwd=pasta)
    rodar(['git', 'pull', '--rebase', url_git(token), 'main'], cwd=pasta, token=token)
    rodar(['node', 'scripts/validar.mjs'], cwd=pasta)          # confere de novo depois de juntar com o remoto
    rodar(['git', 'push', url_git(token), 'HEAD:main'], cwd=pasta, token=token)
    sha = subprocess.run(['git', 'rev-parse', 'HEAD'], cwd=pasta, capture_output=True, text=True).stdout.strip()
    print(f'Enviado ({sha[:7]}). Acompanhando a publicação...')
    for _ in range(36):                                          # até ~6 minutos
        time.sleep(10)
        try:
            runs = [r for r in api('/actions/runs?per_page=5', token).get('workflow_runs', []) if r['head_sha'] == sha]
        except Exception as e:
            print(f'(não consegui consultar o workflow: {e})')
            continue
        if runs and runs[0]['status'] == 'completed':
            r = runs[0]
            if r['conclusion'] == 'success':
                print(f'Publicado com sucesso: {SITE}')
            else:
                print(f"A publicação terminou com '{r['conclusion']}'. Detalhes: {r['html_url']}")
                try:
                    for j in api(f"/actions/runs/{r['id']}/jobs", token).get('jobs', []):
                        for s in j.get('steps', []):
                            if s.get('conclusion') == 'failure':
                                print(f"  Etapa que falhou: {j['name']} > {s['name']}")
                except Exception:
                    pass
            return
    print('A publicação ainda não terminou. Rode: python3 repo.py status')


if __name__ == '__main__':
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    acao = sys.argv[1]
    if acao == 'token' and len(sys.argv) > 2:
        cmd_token(sys.argv[2])
    elif acao == 'clonar':
        cmd_clonar(sys.argv[2] if len(sys.argv) > 2 else PASTA)
    elif acao == 'publicar' and len(sys.argv) > 2:
        cmd_publicar(sys.argv[2])
    elif acao == 'status':
        cmd_status()
    else:
        sys.exit(__doc__)
