# originally from: https://gist.github.com/stefandanzl/61c7d19cad05371435f10fa9ae442bb7

import sqlite3
import json

db_path = "collection.anki2"
conn = sqlite3.connect(db_path)
cur = conn.cursor()
cur.execute("SELECT flds FROM notes")
rows: list[str] = cur.fetchall()

# locations of desired fields in row
cols = [0, 1, 6, 7, 8, 9]
flds: list[list[str]] = []
for row in rows:
    fields = row[0].split('\x1f')
    fields = [fields[f] for f in cols]
    flds.append(fields)

cur.close()
conn.close()

def to_card(fields, i):
    return {
        "id": i,
        "german": fields[0],
        "english": fields[1],
        "ger_sent_1": fields[2],
        "eng_sent_1": fields[3],
        "ger_sent_2": fields[4],
        "eng_sent_2": fields[5],
        "starred": False
    }

def add_types(card):
    if card["german"][:3] == "der":
        card["type"] = "masculine"
    elif card["german"][:3] == "die":
        card["type"] = "feminine"
    elif card["german"][:3] == "das":
        card["type"] = "neuter"
    elif card["english"][:3] == "to ":
        card["type"] = "verb"
    else:
        card["type"] = "other"
    return card

with open("output.json", "w", encoding="utf-8") as fout:
    json_out = {
        "cards": [
            add_types(to_card(fields, i)) for i, fields in enumerate(flds)
        ]
    }
    fout.write(json.dumps(json_out, indent=4))
