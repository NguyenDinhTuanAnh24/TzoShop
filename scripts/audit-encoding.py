from pathlib import Path
import re

ROOT = Path("src")
EXTS = {".ts", ".tsx", ".js", ".jsx", ".json", ".md", ".css"}

# Heuristics:
# - replacement char U+FFFD
# - suspicious "?" inside quoted strings (often lost diacritics)
# - common mojibake bytes interpreted as text
MOJIBAKE_PATTERN = re.compile(r"(Ã.|Ä.|Æ.|â€™|â€œ|â€|Â )")
QMARK_IN_STRING = re.compile(r"\"[^\n\"]*\?[^\n\"]*\"|'[^\n']*\?[^\n']*'")


def main() -> None:
    rows = []
    for path in ROOT.rglob("*"):
        if not path.is_file() or path.suffix not in EXTS:
            continue
        try:
            text = path.read_text(encoding="utf-8")
        except Exception:
            continue

        mojibake = len(MOJIBAKE_PATTERN.findall(text))
        replacement = text.count("\uFFFD")
        qmark_strings = len(QMARK_IN_STRING.findall(text))

        if mojibake or replacement or qmark_strings:
            rows.append((mojibake, replacement, qmark_strings, str(path).replace("\\", "/")))

    rows.sort(key=lambda item: (item[0], item[1], item[2]), reverse=True)
    for mojibake, replacement, qmark_strings, file_path in rows:
        print(f"{mojibake}\t{replacement}\t{qmark_strings}\t{file_path}")
    print(f"TOTAL\t{len(rows)}")


if __name__ == "__main__":
    main()

