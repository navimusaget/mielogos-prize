#!/usr/bin/env python3
"""Scaffold a new Prize Year page without baking Founding-Cycle facts into future years.

Usage:
    python tools/add_cycle.py 2028

Before running, add the new cycle object to data/cycles.json and set exactly
one cycle to "current": true.
"""
from pathlib import Path
import re
import sys

if len(sys.argv) != 2 or not sys.argv[1].isdigit():
    raise SystemExit("Usage: python tools/add_cycle.py YEAR")

year = sys.argv[1]
root = Path(__file__).resolve().parents[1]
src_path = root / "prize-years" / "2027" / "index.html"
out = root / "prize-years" / year / "index.html"

if out.exists():
    raise SystemExit(f"{out} already exists")

src = src_path.read_text(encoding="utf-8")
src = src.replace('data-cycle-year="2027"', f'data-cycle-year="{year}"')
src = src.replace(
    '<title>2027 Founding Cycle — MIELOGOS Literary Prize</title>',
    f'<title>{year} — MIELOGOS Literary Prize</title>'
)
src = src.replace(
    'content="The 2027 Founding Cycle of the MIELOGOS Literary Prize."',
    f'content="The {year} cycle of the MIELOGOS Literary Prize."'
)
src = src.replace('Home</a> / 2027', f'Home</a> / {year}')
src = src.replace(
    '<span data-year-title>2027 Founding Cycle</span>',
    f'<span data-year-title>{year}</span>'
)
src = src.replace(
    'The first MIELOGOS Literary Prize cycle — from open entry to permanent public recognition.',
    f'The {year} MIELOGOS Literary Prize cycle — from open entry to permanent public recognition.'
)
src = src.replace(
    '<p class="eyebrow">2027 public record</p>',
    f'<p class="eyebrow"><span data-year-record-label>{year} public record</span></p>'
)

out.parent.mkdir(parents=True, exist_ok=True)
out.write_text(src, encoding="utf-8")
print(out)
