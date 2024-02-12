const isRequired = () => {
  throw Error("required parameter");
};

const setCurrentVideoCode = (videoCode = isRequired()) => {
  console.log(videoCode);
};

setCurrentVideoCode("VD101");
setCurrentVideoCode();
setCurrentVideoCode(null);
setCurrentVideoCode("");
