const fs = require('fs');
const path = require('path');

// Function to recursively create directories
const createDirectoryRecursively = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

// Function to organize a single file
const organizeFile = (fileName) => {
  // Split the file name by '_'
  const fileParts = fileName.split('_');

  // Get the file extension
  const fileExtension = path.extname(fileName);

  // Extract the actual file name (the last part)
  const actualFileName = fileParts.pop() + fileExtension;

  // Construct the path for the directory (all parts before the last one)
  const directoryPath = path.join(__dirname, ...fileParts); // __dirname makes it relative to the script directory

  // Create directories recursively
  createDirectoryRecursively(directoryPath);

  // Assuming the file is in the same directory as the script
  const originalFilePath = path.join(__dirname, fileName);
  const newFilePath = path.join(directoryPath, actualFileName);

  // Check if the original file exists
  if (!fs.existsSync(originalFilePath)) {
    console.error('File not found:', originalFilePath);
    return;
  }

  // Move the file to the new folder
  fs.rename(originalFilePath, newFilePath, (err) => {
    if (err) {
      console.error('Error moving the file:', err);
    } else {
      console.log(`File successfully moved to: ${newFilePath}`);
    }
  });
};

// Function to process all files in the current directory
const processFilesInDirectory = () => {
  // Get all files in the current directory
  const files = fs.readdirSync(__dirname);

  // Loop through each file and process it
  files.forEach(fileName => {
    // Skip directories, only process files
    const filePath = path.join(__dirname, fileName);
    if (fs.lstatSync(filePath).isFile()) {
      organizeFile(fileName);
    }
  });
};

// Start processing files
processFilesInDirectory();
