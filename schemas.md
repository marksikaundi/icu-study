## Assignments (collection ID: assignments)

title (string, required)
subtitle (string, required)
status (string, required) or type (string, required)
fileUrl (string, optional)
fileKey (string, optional)
fileName (string, optional)

## Materials (collection ID: materials)

title (string, required)
description (string, required) or subtitle (string, required)
type (string, required) or format (string, required)
fileUrl (string, optional)
fileKey (string, optional)
fileName (string, optional)

## Notes (collection ID: notes)

title (string, required)
body (string, required)
updatedAt (string, optional) — UI also uses $updatedAt

## Resources (collection ID: resources)

title (string, required)
subtitle (string, required) or summary (string, required) or description (string, required)
icon (string, required) — one of: archive, book, clipboard, edit-2, edit-3, file, file-text, folder, grid, help-circle, upload, user, bell
type (string, optional)
fileUrl (string, optional)
fileKey (string, optional)
fileName (string, optional)
programName (string, optional)

## Appwrite console steps (quick)

1. Open Appwrite Console -> Databases -> select your database.
2. Create a collection named assignments, then add the columns listed above.
3. Repeat for materials, notes, and resources.
4. For each column, use type string and set required true/false as listed.
5. Permissions: allow read for the roles you want to access the app.
6. Upload files to UploadThing and store the fileUrl + fileKey in your document.
