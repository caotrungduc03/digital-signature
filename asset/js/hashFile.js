const fileToSha256Hex = async (file) => {
  const buffer = await fileToArrayBuffer(file);
  const hashBuffer = await bufferToSha256(buffer);
  return hexString(hashBuffer);
};

const fileToArrayBuffer = async (file) => {
  return new Promise(function (resolve, reject) {
    const reader = new FileReader();
    console.log(reader);
    const readFile = function (event) {
      const buffer = reader.result;
      console.log(buffer);
      resolve(buffer);
    };

    reader.addEventListener('load', readFile);
    reader.readAsArrayBuffer(file);
  });
};

const bufferToSha256 = async (buffer) => {
  return crypto.subtle.digest('SHA-256', buffer);
};

const hexString = (buffer) => {
  const byteArray = new Uint8Array(buffer);
  const hexCodes = [...byteArray].map((value) => {
    return value.toString(16).padStart(2, '0');
  });

  return hexCodes.join('');
};
