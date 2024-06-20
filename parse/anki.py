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
        "goal": fields[0],
        "base": fields[1],
        "goal_sent_1": fields[2],
        "base_sent_1": fields[3],
        "goal_sent_2": fields[4],
        "base_sent_2": fields[5],
        "starred": False
    }

def add_types(card):
    if card["goal"][:3] == "der":
        card["type"] = "masculine"
    elif card["goal"][:3] == "die":
        card["type"] = "feminine"
    elif card["goal"][:3] == "das":
        card["type"] = "neuter"
    elif card["base"][:3] == "to ":
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
