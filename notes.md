NTINUATION PROMPT — Canvas Geometry Box

PROJECT
Folder: D:\Amaippu\Skill-imprv-works\Canvas (Windows, PowerShell)
Files: index.html, app.js, package.json
Tech: plain HTML + Tailwind via CDN + vanilla JavaScript + HTML5 canvas 2D.
No libraries, no frameworks, no build step. Open index.html directly to run.

FIRST ACTION WHEN RESUMING
Read index.html and app.js fully, then run: node --check app.js
Then tell me the current state (what works / what is broken) before giving new code.

MY LEARNING STYLE — FOLLOW THIS STRICTLY
1. I code everything myself. Do NOT edit my files. Give me instructions and code blocks to paste.
2. Tell me exactly WHERE to put each piece (which file, which method, or which nearby line/block). Say "replace this method", "paste after this line", etc.
3. Beginner level only. Use plain syntax: let, if/else, for, while, arrays, objects, functions, addEventListener, Math.* , canvas 2D calls (beginPath, arc, moveTo, lineTo, stroke, fill, fillText, clearRect).
   Avoid: classes beyond the existing Geometry, advanced patterns, destructuring, spread, ternary, template literals, closures tricks, complex one-liners, pre-written helper libraries.
4. After each feature, explain the new syntax in markdown TABLES with two columns: Syntax | Meaning (the same style used before). Group tables by topic (variables, loops, canvas, math, events, arrays).
5. Keep changes in small numbered steps. End each with a test checklist.
6. Always verify syntax with: node --check app.js (no output = OK). If a step fails, find the exact line and explain the error in beginner terms.
7. Do not rewrite my whole project unless I ask. If my file is badly broken, say so and offer a full replacement method-by-method.
8. Be concise in prose, detailed in code and tables. No emojis.

APP DESIGN
Canvas: id="Canvas", 800x600. UI buttons: compassBtn, protractorBtn, penBtn, clearBtn. Info text: id="info".
Three modes stored in this.mode: "compass" (default), "protractor", "pen".

State (constructor of class Geometry):
mouseX, mouseY, centerX, centerY, circles (array)
proX=400, proY=480, proR=260 (protractor position and fixed radius)
draggingPro, proOffsetX, proOffsetY
draggingCenter, centerOffsetX, centerOffsetY, movedCompass
drawing, stroke (array of {x,y}), strokes (array of strokes)
DOM refs: canvas, ctx, info, compassBtn, protractorBtn, penBtn, clearBtn

Event flow (startListening uses let self = this):
mousemove -> update mouseX/mouseY, call handleMouseMove(), call draw()
mousedown -> handleMouseDown(offsetX, offsetY)
mouseup -> handleMouseUp(offsetX, offsetY)
click -> handleClick(offsetX, offsetY)

COMPASS BEHAVIOUR
- When no center is set, draw a 10px crosshair at the mouse (so the tool is visible).
- First click sets centerX/centerY. Preview: circle of radius = distance(center, mouse), radius line, filled 6px centre dot.
- Drag the centre: mousedown within 20px of centre starts draggingCenter (record grab offsets); mousemove moves the centre; movedCompass=true stops the following click from placing a new point.
- Clicking within 20px of the centre is ignored.
- Second click away from the centre saves {centerX, centerY, radius} into circles and clears the centre.

PROTRACTOR BEHAVIOUR
- Fixed radius this.proR, position this.proX/this.proY (must be read inside drawProtractor; not hard-coded).
- Draw: outer half circle, inner half circle at r-70, base line, ticks every 5 degrees (longer every 10), labels every 30 at radius r-45, red arm from centre to the mouse with degree label, only when angle is 0..180.
- Angle: degrees = Math.atan2(-dy, dx) * 180 / Math.PI; negative + 360. y uses minus because canvas y grows down.
- Drag: mousedown inside the half disc (distance <= proR AND y <= proY) starts draggingPro with grab offsets; mousemove repositions the protractor.
- Clicks on canvas do nothing in protractor mode.

PEN BEHAVIOUR
- mousedown: drawing=true, start new stroke with first {x,y} point.
- mousemove while drawing: push points.
- mouseup: if stroke has more than 1 point, push stroke into strokes; reset stroke and drawing.
- draw(): render the current stroke and all saved strokes with moveTo first point + lineTo each next point.
- Clicks do nothing in pen mode.

draw() ORDER: clearRect -> saved circles -> compass preview -> protractor (only in protractor mode) -> crosshair (compass mode, no centre) -> current stroke -> saved strokes -> reset strokeStyle and fillStyle to "black".

CLEAR: empties circles, strokes, current stroke, drawing flag, and centre; protractor stays where it is.

BUTTONS (startButtons): use arrow functions calling named methods setCompassMode(), setProtractorMode(), setPenMode(). Clear has its own inline listener. Button handlers should stay short; put logic in methods.

LAST KNOWN STATE / OPEN ISSUE
My workspace copy last had these bugs (the page was completely dead):
- app.js line ~123: document.gerElementById("penBtn") typo -> constructor crashes -> nothing renders.
- this.setPenMode() was called but the setPenMode method did not exist.
- this.centerX = "null" and this.centerY = "null" used strings instead of the value null.
- Missing constructor state for protractor drag / pen; missing handleMouseDown, handleMouseMove, handleMouseUp; startListening lacked mousedown/mouseup and the handleMouseMove call; draw() lacked crosshair and stroke rendering; drawProtractor used hard-coded 400/480/260 so it could not move.
I was given a full corrected replacement for the class (verified with node --check in a temp file). I may or may not have pasted it. Check the file first and tell me if it matches that corrected version.

KNOWN LIMITATIONS TO MENTION WHEN RELEVANT
- If the mouse is released outside the canvas, mouseup does not fire, so a drag or stroke can stick. A window-level mouseup listener would fix it later (ask before adding).
- Canvas is 800x600 in HTML; if CSS ever scales it, event.offsetX/offsetY will not match canvas pixels (a scale correction would be needed).
- Saved circles cannot be moved/deleted yet. Protractor cannot rotate yet. Only one angle scale (no inner 0-180 scale).

POSSIBLE NEXT FEATURES (ask which one before coding)
1. Rotate the protractor (drag a handle or scroll) and/or add the inner 0-180 scale.
2. Move/delete saved circles; select with click.
3. Undo last stroke/circle; Save canvas as image.
4. Snap compass centre or protractor base to a drawn circle/line for accurate measuring.
5. Make protractor/compass sizes adjustable.
6. Replace the freehand pen with a "mark angle" tool that draws straight rays and labels the angle.