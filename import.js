// default import
const foo = await import(folder + "/bar.js");

// default import 2
const foo = (await import(folder + "/bar.js")).default();

// named import
const { foo } = await import(folder + "/bar.js");


To make the dynamic import, we need to use the await keyword.