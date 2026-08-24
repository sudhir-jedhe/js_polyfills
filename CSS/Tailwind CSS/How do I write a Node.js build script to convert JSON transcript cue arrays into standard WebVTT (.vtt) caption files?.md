To convert JSON transcript cue arrays into standard **WebVTT (`.vtt`)** files, you need to format timestamps strictly into `HH:MM:SS.mmm` (or `MM:SS.mmm` when hours are zero) and structure cue payloads with optional identifiers, voice tags (`<v Speaker>`), and cue settings.

---

### Step 1: WebVTT Timestamp Formatting Rules

* **Format:** `HH:MM:SS.mmm` (Hours, Minutes, Seconds, Milliseconds separated by a period `.`).
* **Delimiter:** The cue timing line requires a space-padded arrow: `-->`.
* **Header:** Files must begin with `WEBVTT` as the first line, followed by an empty line.

---

### Step 2: Build the Conversion Script (`scripts/json-to-webvtt.ts`)

```typescript
// scripts/json-to-webvtt.ts
import * as fs from "node:fs";
import * as path from "node:path";

export interface TranscriptCue {
  id?: string;
  start: number; // Start time in seconds (e.g. 12.45)
  end: number;   // End time in seconds (e.g. 16.80)
  speaker?: string;
  text: string;
  settings?: string; // Optional cue placement settings, e.g. "line:85% align:center"
}

/**
 * Formats decimal seconds into WebVTT timestamp format: HH:MM:SS.mmm
 */
export function formatVttTimestamp(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) {
    seconds = 0;
  }

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const totalSeconds = Math.floor(seconds % 60);
  const milliseconds = Math.floor((seconds % 1) * 1000);

  const hh = hours.toString().padStart(2, "0");
  const mm = minutes.toString().padStart(2, "0");
  const ss = totalSeconds.toString().padStart(2, "0");
  const mmm = milliseconds.toString().padStart(3, "0");

  return `${hh}:${mm}:${ss}.${mmm}`;
}

/**
 * Converts an array of transcript cues into a valid WebVTT string
 */
export function jsonToWebVTT(
  cues: TranscriptCue[],
  options: { title?: string; includeVoiceTags?: boolean } = {}
): string {
  const { title, includeVoiceTags = true } = options;
  const lines: string[] = ["WEBVTT"];

  if (title) {
    lines[0] = `WEBVTT - ${title}`;
  }
  lines.push(""); // Required empty line after header

  cues.forEach((cue, index) => {
    // 1. Optional Cue Identifier
    const cueId = cue.id || `cue-${index + 1}`;
    lines.push(cueId);

    // 2. Timing line: 00:00:01.000 --> 00:00:04.500 [settings]
    const startTime = formatVttTimestamp(cue.start);
    const endTime = formatVttTimestamp(cue.end);
    const settingsStr = cue.settings ? ` ${cue.settings}` : "";
    lines.push(`${startTime} --> ${endTime}${settingsStr}`);

    // 3. Payload with optional voice tag markup: <v Speaker>Text</v>
    let textPayload = cue.text.trim();
    if (includeVoiceTags && cue.speaker) {
      textPayload = `<v ${cue.speaker}>${textPayload}`;
    }

    lines.push(textPayload);
    lines.push(""); // Blank line between cues
  });

  return lines.join("\n");
}

/**
 * File processor: Reads a JSON file and writes out the .vtt file
 */
export function convertTranscriptFile(inputJsonPath: string, outputVttPath: string) {
  const absoluteInput = path.resolve(process.cwd(), inputJsonPath);
  const absoluteOutput = path.resolve(process.cwd(), outputVttPath);

  const rawData = fs.readFileSync(absoluteInput, "utf-8");
  const cues: TranscriptCue[] = JSON.parse(rawData);

  const vttContent = jsonToWebVTT(cues, {
    title: path.basename(inputJsonPath, ".json"),
    includeVoiceTags: true,
  });

  fs.mkdirSync(path.dirname(absoluteOutput), { recursive: true });
  fs.writeFileSync(absoluteOutput, vttContent, "utf-8");

  console.log(`✅ Converted ${cues.length} cues: ${inputJsonPath} -> ${outputVttPath}`);
}

// ---------------------------------------------------------------------------
// Example Execution CLI / Demo
// ---------------------------------------------------------------------------
const SAMPLE_CUES: TranscriptCue[] = [
  {
    id: "intro-001",
    start: 0.5,
    end: 4.25,
    speaker: "Elena Rostova",
    text: "Welcome to this technical session on OKLCH color interpolation.",
  },
  {
    id: "intro-002",
    start: 4.8,
    end: 9.1,
    speaker: "Elena Rostova",
    text: "Traditional RGB and HSL models introduce perceptual distortions in dark mode.",
  },
  {
    id: "intro-003",
    start: 9.5,
    end: 15.0,
    speaker: "Marcus Chen",
    text: "By decoupling Lightness, Chroma, and Hue, we guarantee uniform contrast ratios.",
  },
];

// Write sample output to public captions directory
fs.mkdirSync(path.resolve(process.cwd(), "public/captions"), { recursive: true });
const outputVtt = jsonToWebVTT(SAMPLE_CUES, { title: "OKLCH Design Tokens" });
fs.writeFileSync(path.resolve(process.cwd(), "public/captions/sample-en.vtt"), outputVtt);

```

---

### Step 3: Generated Output (`public/captions/sample-en.vtt`)

Running the script produces valid WebVTT formatting:

```vtt
WEBVTT - OKLCH Design Tokens

intro-001
00:00:00.500 --> 00:00:04.250
<v Elena Rostova>Welcome to this technical session on OKLCH color interpolation.

intro-002
00:00:04.800 --> 00:00:09.100
<v Elena Rostova>Traditional RGB and HSL models introduce perceptual distortions in dark mode.

intro-003
00:00:09.500 --> 00:00:15.000
<v Marcus Chen>By decoupling Lightness, Chroma, and Hue, we guarantee uniform contrast ratios.

```

---

### Step 4: Batch Processing Directory Script

To process an entire directory of JSON transcript files automatically in your build pipeline:

```typescript
// scripts/build-all-captions.ts
import * as fs from "node:fs";
import * as path from "node:path";
import { convertTranscriptFile } from "./json-to-webvtt";

const TRANSCRIPTS_DIR = path.resolve(process.cwd(), "data/transcripts");
const OUTPUT_DIR = path.resolve(process.cwd(), "public/captions");

export function buildAllCaptions() {
  if (!fs.existsSync(TRANSCRIPTS_DIR)) {
    console.warn(`Directory not found: ${TRANSCRIPTS_DIR}`);
    return;
  }

  const files = fs.readdirSync(TRANSCRIPTS_DIR).filter((f) => f.endsWith(".json"));

  for (const file of files) {
    const inputPath = path.join(TRANSCRIPTS_DIR, file);
    const outputPath = path.join(OUTPUT_DIR, `${path.basename(file, ".json")}.vtt`);
    convertTranscriptFile(inputPath, outputPath);
  }
}

buildAllCaptions();

```

---

### Step 5: Add to `package.json`

```json
{
  "scripts": {
    "captions:build": "npx tsx scripts/build-all-captions.ts",
    "prebuild": "npm run captions:build"
  }
}

```
