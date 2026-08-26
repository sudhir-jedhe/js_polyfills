*** copy file1.md ***

import singletonCounter from "./Counter";
import "./file2";

singletonCounter.incrementCount(); // 2
singletonCounter.incrementCount(); // 3
