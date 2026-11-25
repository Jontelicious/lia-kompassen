#!/usr/bin/env python3
"""Serve this template on loopback only; Python standard library, no install step."""
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

if __name__ == '__main__':
    handler = partial(SimpleHTTPRequestHandler, directory=str(Path(__file__).resolve().parent))
    try:
        with ThreadingHTTPServer(('127.0.0.1', 8765), handler) as server:
            print('LIA-kompassen: http://127.0.0.1:8765/\nStoppa med Ctrl+C.', flush=True)
            try:
                server.serve_forever()
            except KeyboardInterrupt:
                pass
    except OSError as error:
        print(f'Kunde inte starta servern: {error}\nKontrollera om den redan körs på port 8765.')
        raise SystemExit(1)
