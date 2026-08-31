# Fichiers de données (`src/main/ts/armyc2/c5isr/data/`)

`d` = MIL-STD-2525D / APP-6D, `e` = MIL-STD-2525E / APP-6E.

| Fichier | Contenu | Entrées |
|---|---|---|
| `c2d.json` | Table de correspondance 2525C → 2525D ch1 : pour chaque SymbolID 2525C (`basic`), le code d'équivalence 2525D (`ss`, `ec`, `s1`, `s2`) + libellé (`e`/`et`) | 1915 |
| `genc.json` | Table des codes pays GENC : code 2 lettres, 3 lettres, code numérique et nom du pays | 280 |
| `msd.json` | Dictionnaire de symboles 2525D : code hiérarchique (`ss`/`code`) → libellé (`e` entity, `et` entity type, `est` entity subtype) | 2114 |
| `mse.json` | Équivalent de `msd.json` mais pour 2525E | 2190 |
| `smd.json` | "Sector modifiers" (modificateurs sectoriels) pour 2525D : nom, catégorie, code | 737 |
| `sme.json` | Idem `smd.json` mais pour 2525E | 709 |
| `svg6d.json` | Fragments SVG spécifiques à APP-6D (norme OTAN équivalente à 2525D) : id, géométrie (X, Y, Width, Height), code SVG. Ne contient que les icônes qui diffèrent de 2525D (fallback vers `svgd.json` sinon) | 222 |
| `svg6e.json` | Idem `svg6d.json` mais pour APP-6E (équivalent OTAN de 2525E, fallback vers `svge.json`) | 258 |
| `svgd.json` | Bibliothèque complète des fragments SVG (frames, icônes, amplifiers) pour 2525D | 3935 |
| `svge.json` | Idem `svgd.json` mais pour 2525E | 3927 |

Résumé par famille :
- **c2d** : passerelle entre l'ancienne norme 2525C et 2525D.
- **genc/msd/mse/smd/sme** : dictionnaires texte (codes → libellés) pour pays, symboles et modificateurs.
- **svg6d/svg6e/svgd/svge** : bibliothèques de dessins vectoriels (SVG) utilisées pour rendre les symboles graphiquement.

1. modifier le fichier `create-light-data.ts`
2. `npx tsx create-light-data.ts`
3. `npm run buildWeb`
4. Tester sur `test-missions-build.html`

Dernier test normal

```
Destroy {"type":"error","error":"There was an error creating the MilStdSymbol 130325000034090000000000000000 - ID: ID - Basic ID: 25340900 is not a multipoint symbol"} <anonymous code>:1:147461
Interdict {"type":"error","error":"There was an error creating the MilStdSymbol 130325000034140000000000000000 - ID: ID - Basic ID: 25341400 is not a multipoint symbol"} <anonymous code>:1:147461
Neutralize {"type":"error","error":"There was an error creating the MilStdSymbol 130325000034160000000000000000 - ID: ID - Basic ID: 25341600 is not a multipoint symbol"}
```