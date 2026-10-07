# Media capture — how the case-study screenshots were made

Not part of the site build. These reproduce the software screenshots in
`public/work/`, so they can be re-shot when a client's software changes (the
Gorkha Jewellery app is being replaced — swap its screen with `Snap.java`).

Every capture is the **real interface** running against **sample data**. None of
it touches a client's real records, and the case pages say so under each image.

## Web apps (OZI HP WMS + portal, Scalina CRM, OZI HP website)

Run each app's frontend locally, then point a script at it. The scripts stub the
API with Playwright route interception, so no backend or database is needed.

```bash
# in a scratch folder, not this repo
npm i playwright
gh repo clone sianshrestha/packaging-wms -- --depth 1
(cd packaging-wms/frontend && npm ci && npx vite --port 5301)   # WMS + portal
(cd packaging-wms/landing  && npm ci && npx next dev -p 5302)   # website
gh repo clone sianshrestha/Scalina-CRM -- --depth 1
(cd Scalina-CRM/scalina-crm-ui && npm i && npx vite --port 5303) # CRM
node shoot-wms.mjs ./shots
node shoot-crm.mjs ./shots
node shoot-y.mjs http://localhost:5302 ./shots/site.png 1440 900 0.235   # fraction = scroll position
```

Uses the installed Google Chrome (`channel: 'chrome'`), so no Playwright browser
download is required.

## Gorkha Jewellery (JavaFX desktop)

`Snap.java` boots the real app's Spring context against an in-memory H2
database (so nothing is written to `~/Documents`), loads the real FXML, fills a
sample invoice and renders the window to PNG at 2×.

```bash
gh repo clone sianshrestha/GorkhaJewellery -- --depth 1 && cd GorkhaJewellery
# lombok 1.18.30 does not build on JDK 23 — bump it to 1.18.38 in pom.xml first
mvn -q -DskipTests package && mvn -q dependency:build-classpath -Dmdep.outputFile=cp.txt
CP="target/classes:$(cat cp.txt)"
javac -cp "$CP" -d snap/out Snap.java SnapMain.java
java -Dout=gorkha-invoice.png -cp "snap/out:$CP" SnapMain
```

## Then

```bash
cwebp -q 80 -resize 1800 0 shot.png -o public/work/<client>/<name>.webp
```

and update the `w`/`h` in `lib/work.ts` if the size changed.
