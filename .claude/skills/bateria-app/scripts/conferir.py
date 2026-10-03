#!/usr/bin/env python3
"""Abre o site montado (dist/) num navegador sem tela e confere todos os exercícios.

Uso: python3 conferir.py /home/claude/Bateria/dist
Precisa de Playwright com Chromium (já disponível no ambiente do Claude).
"""
import asyncio, functools, http.server, socket, sys, threading
from playwright.async_api import async_playwright


def servir(pasta):
    s = socket.socket(); s.bind(('127.0.0.1', 0)); porta = s.getsockname()[1]; s.close()
    class Silencioso(http.server.SimpleHTTPRequestHandler):
        def log_message(self, *a):
            pass
    manipulador = functools.partial(Silencioso, directory=pasta)
    srv = http.server.ThreadingHTTPServer(('127.0.0.1', porta), manipulador)
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    return srv, porta


async def conferir(pasta):
    srv, porta = servir(pasta)
    problemas, erros, total = [], [], 0
    async with async_playwright() as p:
        nav = await p.chromium.launch(args=['--autoplay-policy=no-user-gesture-required'])
        ctx = await nav.new_context(viewport={'width': 390, 'height': 844})
        await ctx.route('https://fonts.**', lambda r: r.abort())
        pg = await ctx.new_page()
        pg.on('pageerror', lambda e: erros.append(str(e)))
        await pg.goto(f'http://127.0.0.1:{porta}/')
        await pg.wait_for_timeout(1200)
        ncat = await pg.locator('.cat').count()
        for ci in range(ncat):
            cat = await pg.locator('.cat h3').nth(ci).text_content()
            await pg.locator('.cat').nth(ci).click(); await pg.wait_for_timeout(80)
            linhas = pg.locator('.ex-linha:not(.novo-linha)')
            for i in range(await linhas.count()):
                await linhas.nth(i).click(); await pg.wait_for_timeout(60)
                st = await pg.evaluate("""() => ({
                  nome: document.querySelector('#exNome').textContent,
                  svg: !!document.querySelector('#vf svg') || !document.querySelector('#foto').hidden,
                  casas: document.querySelectorAll('.g-cel,.rg-nota').length })""")
                total += 1
                if not st['svg'] or st['casas'] == 0:
                    problemas.append(f"{cat} › {st['nome']}: " + ('sem partitura' if not st['svg'] else 'grade vazia'))
                await pg.go_back(); await pg.wait_for_timeout(40)
            await pg.go_back(); await pg.wait_for_timeout(60)
        # toca um exercício por 1 segundo
        await pg.locator('.cat').first.click(); await pg.locator('.ex-linha').first.click()
        await pg.click('#tpPlay'); await pg.wait_for_timeout(1000); await pg.click('#tpPlay')
        await nav.close()
    srv.shutdown()
    print(f'Exercícios conferidos: {total} em {ncat} categorias.')
    if problemas:
        print('Problemas:\n- ' + '\n- '.join(problemas))
    if erros:
        print('Erros de JavaScript:\n- ' + '\n- '.join(erros[:10]))
    if not problemas and not erros:
        print('Tudo certo.')
    return 1 if (problemas or erros) else 0


if __name__ == '__main__':
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    sys.exit(asyncio.run(conferir(sys.argv[1])))
