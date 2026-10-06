#!/usr/bin/env python3
"""Scaffold a new Prize Year page without changing templates.
Usage: python tools/add_cycle.py 2028
Then add/update that year's factual dates in data/cycles.json.
"""
from pathlib import Path
import sys
if len(sys.argv)!=2 or not sys.argv[1].isdigit(): raise SystemExit('Usage: python tools/add_cycle.py YEAR')
year=sys.argv[1]
root=Path(__file__).resolve().parents[1]
out=root/'prize-years'/year/'index.html'
if out.exists(): raise SystemExit(f'{out} already exists')
src=(root/'prize-years'/'2027'/'index.html').read_text()
src=src.replace('2027 Founding Cycle — MIELOGOS Literary Prize',f'{year} — MIELOGOS Literary Prize').replace('The 2027 Founding Cycle of the MIELOGOS Literary Prize.',f'The {year} cycle of the MIELOGOS Literary Prize.').replace('data-cycle-year="2027"',f'data-cycle-year="{year}"')
out.parent.mkdir(parents=True,exist_ok=True); out.write_text(src)
print(out)
