# 大清县令 · The Magistrate

A free, bilingual (Chinese / English) interactive history game about evidence, local politics, and justice in Qing China. Developer: **Jinju Wu**.

## Play

Open `index.html` in a modern browser, or visit the GitHub Pages deployment. No build system or server required.

## Gameplay

- Three original fictional cases: **The Missing Ox / 失牛之夜**, **A Line Through the Fields / 一线田界**, and **The Silver Question / 碎银疑局**.
- Nine consequential decisions: investigation, testimony, judgment for each case.
- Clues and evidence journal, three variable indicators (integrity / public trust / official standing), several possible endings.
- Chinese and English switch, keyboard choices `1–3`, responsive layout, optional locally synthesized sound.
- Saved progress in the current browser only (localStorage). No accounts, cookies, analytics, or uploads.

## Historical note

This is **historically informed fiction**, not a game adaptation of an actual Qing legal case. The characters, cases, choices, score indicators, and ending narratives are invented. The county magistrate's broad administrative and judicial responsibilities, role of petitions, contracts, local mediation, and oversight for serious criminal cases are based on scholarship. In particular, do not interpret the playable options as direct quotations of the *Great Qing Code*.

Suggested further reading:

- Philip C. C. Huang, “Between Informal Mediation and Formal Adjudication,” *Modern China* 19, no. 3 (1993): 251–298. <https://en.lishiyushehui.cn/article/download/151>
- Philip C. C. Huang, *Civil Justice in China: Representation and Practice in the Qing* (Stanford University Press, 1996).
- Linxia Liang, *Delivering Justice in Qing China: Civil Trials in the Magistrate's Court* (Oxford University Press, 2007). <https://www.jstor.org/stable/jj.31510144>
- Columbia University, Asia for Educators, translated excerpts from the casebook of Qing magistrate Lan Dingyuan. <https://afe.easia.columbia.edu/ps/china/depraved_religious_sects.pdf>

## Deploying

All paths are relative. Upload this folder to any static host. For a new GitHub repository, put the three site files in the repository root, then enable GitHub Pages: **Settings → Pages → Deploy from a branch → main / root**. The site will be available at `https://<username>.github.io/<repository>/` once Pages finishes publishing.

## Files

- `index.html` — semantic page structure and decorative inline SVG
- `styles.css` — responsive ink-and-paper interface
- `game.js` — localized narrative, choices, scoring, browser save system

No installation or package manager needed.