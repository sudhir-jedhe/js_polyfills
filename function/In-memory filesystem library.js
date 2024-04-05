createDirectory(name) – Creates a new directory at the current path.
changeDirectory(path) – Changes the directory path.
addFile(name) – Adds a new file at the current path.
deleteFile(name) – Deletes the file with given name at the current path.
deleteDirectory(name) – Deletes the directory with given name at the given path.
getRootDirectory – Returns the root directory and all its nested childs.
getCurDirectory – Returns the items of current directory.
getCurDirectoryPath – Returns the path of the current directory.


const FileSystem = function(){
    this.directory = {"root": {}};
    this.currentDir = this.directory["root"];
    this.currentDirPath = "root";
    
    this.createDirectory = function(name){
      this.currentDir[name] = {};
    }
    
    this.changeDirectory = function(path) {
      this.currentDir = this._changeDirectoryHelper(path);
      this.currentDirPath = path;
    }
    
    this._changeDirectoryHelper = function(path) {
      const paths = path.split("-");
      let current = this.directory;
      for(let key of paths){
        current = current[key];
      }
      
      return current;
    }
    
    this.getCurDirectoryPath = function(){
      return this.currentDirPath;
    }
    
    this.getCurDirectory = function(){
      return this.currentDir;
    }
    
    this.addFile = function(fileName){
      if(this.currentDir.files){
        this.currentDir.files.push(fileName);
      }else{
        this.currentDir["files"] = [fileName];
      }
      return true;
    }
    
    this.deleteFile = function(fileName){
      this.currentDir.files = this.currentDir.files.filter((e) => e !== fileName);
      return true;
    }
    
    this.deleteDirectory = function(name){
      delete this.currentDir[name];
    }
    
    this.getRootDirectory = function(){
      return this.directory;
    } 
  }




  Input:
const dir = new FileSystem();
dir.createDirectory('prashant');
dir.changeDirectory('root-prashant');
dir.addFile('index.html');
dir.addFile('app.js');
dir.changeDirectory('root');
dir.createDirectory('practice');
dir.changeDirectory('root-practice');
dir.addFile('index.html');
dir.addFile('app.js');
dir.createDirectory('build');
dir.changeDirectory('root-practice-build');
dir.addFile('a.png');
dir.addFile('b.jpg');
dir.deleteFile('a.png');
dir.changeDirectory('root');
dir.deleteDirectory('prashant');
console.log(dir.getRootDirectory());

Output:
{
  "root": {
    "practice": {
      "files": [
        "index.html",
        "app.js"
      ],
      "build": {
        "files": [
          "b.jpg"
        ]
      }
    }
  }
}