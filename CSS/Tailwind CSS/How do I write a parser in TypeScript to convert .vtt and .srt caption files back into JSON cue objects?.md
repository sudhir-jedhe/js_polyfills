*** copy How do I write a parser in TypeScript to convert .vtt and .srt caption files back into JSON cue objects?.md ***

To parse both **WebVTT (`.vtt`)** and **SubRip (`.srt`)** caption files into strongly typed JSON cue objects in TypeScript, you need a robust parser that handles:

1. **Timestamp formatting differences:** WebVTT uses periods for milliseconds (`00:01:23.456` or `01:23.456`), while SRT uses commas (`00:01:23,456`).
2. **Metadata & headers:** Ignoring `WEBVTT` headers, `NOTE` comments, and region definitions.
3. **Voice tags & speaker tags:** Extracting `<v Speaker>` tags or `Speaker: Text` prefixes.
4. **Cue settings:** Extracting alignment and positioning metadata (e.g., `line:85% align:center`).

---

### Step 1: Define the TypeScript Interfaces

```typescript
// types/caption.ts
export interface ParsedCue {
  id?: string;
  start: number;       // Start time in decimal seconds (e.g., 83.456)
  end: number;         // End time in decimal seconds
  duration: number;    // end - start in seconds
  speaker?: string;    // Extracted speaker name
  text: string;        // Clean text content
  rawText: string;     // Original unparsed text (with markup/tags)
  settings?: Record<string, string>; // Parsed cue settings (line, align, etc.)
}

export interface ParsedCaptionDocument {
  format: "vtt" | "srt";
  title?: string;
  cues: ParsedCue[];
}

```

---

### Step 2: Timestamp Parsing Utility

This parser accepts both `HH:MM:SS.mmm`, `HH:MM:SS,mmm`, and shortened `MM:SS.mmm` timestamp formats:

```typescript
// utils/time-parser.ts

/**
 * Converts timestamp strings ("01:23:45.678" or "01:23,456") to decimal seconds
 */
export function parseTimestampToSeconds(timestamp: string): number {
  const normalized = timestamp.trim().replace(",", ".");
  const parts = normalized.split(":");

  if (parts.length === 3) {
    // HH:MM:SS.mmm
    const hours = parseFloat(parts[0]);
    const minutes = parseFloat(parts[1]);
    const seconds = parseFloat(parts[2]);
    return Number((hours * 3600 + minutes * 60 + seconds).toFixed(3));
  } else if (parts.length === 2) {
    // MM:SS.mmm
    const minutes = parseFloat(parts[0]);
    const seconds = parseFloat(parts[1]);
    return Number((minutes * 60 + seconds).toFixed(3));
  }

  return 0;
}

```

---

### Step 3: Core Universal Parser Implementation

```typescript
// parsers/caption-parser.ts
import { ParsedCue, ParsedCaptionDocument } from "../types/caption";
import { parseTimestampToSeconds } from "../utils/time-parser";

const TIMING_LINE_REGEX =
  /((?:\d{2}:)?\d{2}:\d{2}[.,]\d{3})\s*-->\s*((?:\d{2}:)?\d{2}:\d{2}[.,]\d{3})(.*)/;

const VOICE_TAG_REGEX = /<v\s+([^>]+)>(.*?)<\/v>|<v\s+([^>]+)>(.*)/s;
const SPEAKER_PREFIX_REGEX = /^([A-Z][A-Za-z\s.-]+):\s*(.*)/s;

/**
 * Parses WebVTT cue settings like "line:85% align:center position:50%"
 */
function parseSettings(settingsStr: string): Record<string, string> {
  const settings: Record<string, string> = {};
  const tokens = settingsStr.trim().split(/\s+/);

  for (const token of tokens) {
    const [key, value] = token.split(":");
    if (key && value) {
      settings[key] = value;
    }
  }

  return settings;
}

/**
 * Extracts speaker name and cleans the text payload
 */
function extractSpeakerAndText(rawText: string): { speaker?: string; text: string } {
  let cleaned = rawText.trim();
  let speaker: string | undefined;

  // 1. Check for WebVTT voice tags: <v Jane Doe>Hello</v> or <v Jane Doe>Hello
  const voiceMatch = cleaned.match(VOICE_TAG_REGEX);
  if (voiceMatch) {
    speaker = voiceMatch[1] || voiceMatch[3];
    cleaned = (voiceMatch[2] || voiceMatch[4] || "").trim();
  } else {
    // 2. Check for standard "Speaker: Text" pattern
    const speakerMatch = cleaned.match(SPEAKER_PREFIX_REGEX);
    if (speakerMatch) {
      speaker = speakerMatch[1].trim();
      cleaned = speakerMatch[2].trim();
    }
  }

  // Strip remaining HTML-like tags (e.g., <b>, <i>, <c.color>)
  const plainText = cleaned.replace(/<[^>]+>/g, "").trim();

  return { speaker, text: plainText };
}

/**
 * Universal Caption Parser for .vtt and .srt formats
 */
export function parseCaptions(source: string): ParsedCaptionDocument {
  // Normalize line endings
  const normalized = source.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  const isVtt = normalized.trimStart().startsWith("WEBVTT");

  const lines = normalized.split("\n");
  const cues: ParsedCue[] = [];
  let title: string | undefined;

  // Extract optional header title from "WEBVTT - My Title"
  if (isVtt) {
    const firstLine = lines[0].trim();
    if (firstLine.includes(" - ")) {
      title = firstLine.split(" - ")[1]?.trim();
    }
  }

  // Split into raw blocks separated by blank lines
  const rawBlocks = normalized.split(/\n\s*\n/);

  for (const block of rawBlocks) {
    const blockLines = block
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    if (blockLines.length === 0) continue;

    // Ignore headers, STYLE blocks, and comments
    if (
      blockLines[0].startsWith("WEBVTT") ||
      blockLines[0].startsWith("NOTE") ||
      blockLines[0].startsWith("STYLE") ||
      blockLines[0].startsWith("REGION")
    ) {
      continue;
    }

    // Locate the line with the timestamp arrow "-->"
    const timingIndex = blockLines.findIndex((line) => TIMING_LINE_REGEX.test(line));
    if (timingIndex === -1) continue;

    const timingLine = blockLines[timingIndex];
    const match = timingLine.match(TIMING_LINE_REGEX);
    if (!match) continue;

    const [, startStr, endStr, settingsStr] = match;
    const start = parseTimestampToSeconds(startStr);
    const end = parseTimestampToSeconds(endStr);
    const duration = Number((end - start).toFixed(3));

    // Optional cue identifier (preceding line if it exists and isn't the timing line)
    const id = timingIndex > 0 ? blockLines[timingIndex - 1] : undefined;

    // Content lines following the timing line
    const textLines = blockLines.slice(timingIndex + 1);
    const rawText = textLines.join("\n");

    const { speaker, text } = extractSpeakerAndText(rawText);
    const settings = settingsStr.trim() ? parseSettings(settingsStr) : undefined;

    cues.push({
      id,
      start,
      end,
      duration,
      speaker,
      text,
      rawText,
      ...(settings && Object.keys(settings).length > 0 ? { settings } : {}),
    });
  }

  return {
    format: isVtt ? "vtt" : "srt",
    title,
    cues,
  };
}

```

---

### Step 4: Example Input and Parsed Output

#### Example 1: WebVTT Input with Settings & Voice Tags

```typescript
const vttInput = `WEBVTT - Design Tokens Keynote

intro-cue
00:00:01.500 --> 00:00:04.250 line:85% align:center
<v Elena Rostova>Welcome to this technical session on OKLCH color interpolation.</v>

00:00:04.800 --> 00:00:09.100
Marcus Chen: Traditional RGB models cause perceptual distortion.
`;

const result = parseCaptions(vttInput);
console.log(JSON.stringify(result, null, 2));

```

**Parsed JSON Result:**

```json
{
  "format": "vtt",
  "title": "Design Tokens Keynote",
  "cues": [
    {
      "id": "intro-cue",
      "start": 1.5,
      "end": 4.25,
      "duration": 2.75,
      "speaker": "Elena Rostova",
      "text": "Welcome to this technical session on OKLCH color interpolation.",
      "rawText": "<v Elena Rostova>Welcome to this technical session on OKLCH color interpolation.</v>",
      "settings": {
        "line": "85%",
        "align": "center"
      }
    },
    {
      "start": 4.8,
      "end": 9.1,
      "duration": 4.3,
      "speaker": "Marcus Chen",
      "text": "Traditional RGB models cause perceptual distortion.",
      "rawText": "Marcus Chen: Traditional RGB models cause perceptual distortion."
    }
  ]
}

```

---

#### Example 2: SRT Input with Comma Milliseconds & Index Numbers

```typescript
const srtInput = `1
00:00:01,250 --> 00:00:03,800
<i>Welcome to the conference.</i>

2
00:00:04,100 --> 00:00:07,500
Dr. Smith: Today we explore fluid typography.
`;

const srtResult = parseCaptions(srtInput);
console.log(JSON.stringify(srtResult, null, 2));

```

**Parsed JSON Result:**

```json
{
  "format": "srt",
  "cues": [
    {
      "id": "1",
      "start": 1.25,
      "end": 3.8,
      "duration": 2.55,
      "text": "Welcome to the conference.",
      "rawText": "<i>Welcome to the conference.</i>"
    },
    {
      "id": "2",
      "start": 4.1,
      "end": 7.5,
      "duration": 3.4,
      "speaker": "Dr. Smith",
      "text": "Today we explore fluid typography.",
      "rawText": "Dr. Smith: Today we explore fluid typography."
    }
  ]
}

```

---

### Step 5: Node.js File Batch Conversion Script

```typescript
// scripts/convert-captions-to-json.ts
import * as fs from "node:fs";
import * as path from "node:path";
import { parseCaptions } from "../parsers/caption-parser";

export function convertCaptionFiles(inputDir: string, outputDir: string) {
  const resolvedInput = path.resolve(process.cwd(), inputDir);
  const resolvedOutput = path.resolve(process.cwd(), outputDir);

  if (!fs.existsSync(resolvedInput)) return;
  fs.mkdirSync(resolvedOutput, { recursive: true });

  const files = fs
    .readdirSync(resolvedInput)
    .filter((f) => f.endsWith(".vtt") || f.endsWith(".srt"));

  for (const file of files) {
    const rawContent = fs.readFileSync(path.join(resolvedInput, file), "utf-8");
    const parsed = parseCaptions(rawContent);

    const outName = `${path.basename(file, path.extname(file))}.json`;
    fs.writeFileSync(
      path.join(resolvedOutput, outName),
      JSON.stringify(parsed.cues, null, 2),
      "utf-8"
    );

    console.log(`✅ Parsed ${parsed.cues.length} cues: ${file} -> ${outName}`);
  }
}

// Example invocation:
convertCaptionFiles("public/captions", "public/data/transcripts");

```
