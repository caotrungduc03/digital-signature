const handleRandomPrimeNums = (btnId) => {
  $(btnId).on('click', function (e) {
    const startNum = parseInt($('#startNum').val());
    const endNum = parseInt($('#endNum').val());
    if (!startNum || !endNum) {
      return alert('Vui lòng nhập phạm vi cặp số nguyên tố!');
    }
    if (startNum >= endNum) {
      return alert('Phạm vi không hợp lệ!');
    }

    let p = getRandomPrime(startNum, endNum);
    let q = getRandomPrime(startNum, endNum);
    let count = 0;
    while (p === q) {
      if (count++ > 1000) return alert('Không tìm được 2 số nguyên tố khác nhau trong phạm vi!');
      q = getRandomPrime(startNum, endNum);
    }
    $('#firstPrimeNum').val(p);
    $('#secondPrimeNum').val(q);
  });
};

const handleGenerateKeys = (btnId) => {
  $(btnId).on('click', function (e) {
    const p = parseInt($('#firstPrimeNum').val());
    const q = parseInt($('#secondPrimeNum').val());
    if (!p || !q) {
      return alert('Vui lòng nhập cặp số nguyên tố!');
    }
    if (p === q) {
      return alert('p không trùng q!');
    }
    if (!isPrime(p) || !isPrime(q)) {
      return alert('p, q không phải là số nguyên tố!');
    }

    const { publicKey, privateKey } = generateRSAKeyPair(p, q);
    $('#firstPublicNum1').val(publicKey.e);
    $('#secondPublicNum1').val(publicKey.n);
    $('#firstSecretNum1').val(privateKey.d);
    $('#secondSecretNum1').val(privateKey.n);
  });
};

const handleClear = (btnId) => {
  $(btnId).on('click', function () {
    const tabNum = btnId.at(-1);
    switch (tabNum) {
      case '1':
        $('#startNum').val('');
        $('#endNum').val('');
        $('#firstPrimeNum').val('');
        $('#secondPrimeNum').val('');
        $('#firstPublicNum1').val('');
        $('#secondPublicNum1').val('');
        $('#firstSecretNum1').val('');
        $('#secondSecretNum1').val('');
        break;
      case '2':
        $('#plainText1').val('');
        $('#firstSecretNum2').val('');
        $('#secondSecretNum2').val('');
        $('#hashText1').val('');
        $('#signature1').val('');
        break;
      case '3':
        $('#plainText2').val('');
        $('#firstPublicNum2').val('');
        $('#secondPublicNum2').val('');
        $('#hashText2').val('');
        $('#signature2').val('');
        $('#result').val('');
        break;
    }
  });
};

const handleCreateSignature = (btnId) => {
  $(btnId).on('click', async function (e) {
    const file = $('#plainText1').prop('files')[0];
    if (!file) {
      return alert('Vui lòng chọn file!');
    }
    const firstSecretNum = $('#firstSecretNum2').val();
    const secondSecretNum = $('#secondSecretNum2').val();
    if (!firstSecretNum || !secondSecretNum) {
      return alert('Vui lòng nhập khoá bí mật!');
    }

    try {
      const hashText = await fileToSha256Hex(file);
      const signature = encrypt(hashText, firstSecretNum, secondSecretNum);
      $('#hashText1').val(hashText);
      $('#signature1').val(signature);
    } catch (e) {
      alert(e.message);
    }
  });
};

const handleSaveSignature = (btnId) => {
  $(btnId).on('click', async function (e) {
    const link = document.createElement('a');
    const content = $('#signature1').val();
    const file = new Blob([content], { type: 'text/plain' });
    link.href = URL.createObjectURL(file);
    link.download = 'signature.txt';
    link.click();
    URL.revokeObjectURL(link.href);
  });
};

const handleMoveData = (btnId) => {
  $(btnId).on('click', function (e) {
    const tabNum = btnId.at(-1);
    switch (tabNum) {
      case '1':
        const firstPublicNum1 = $('#firstPublicNum1').val();
        const secondPublicNum1 = $('#secondPublicNum1').val();
        const firstSecretNum1 = $('#firstSecretNum1').val();
        const secondSecretNum1 = $('#secondSecretNum1').val();
        $('#firstPublicNum2').val(firstPublicNum1);
        $('#secondPublicNum2').val(secondPublicNum1);
        $('#firstSecretNum2').val(firstSecretNum1);
        $('#secondSecretNum2').val(secondSecretNum1);
        break;
      case '2':
        const signature = $('#signature1').val();
        $('#signature2').val(signature);
        break;
    }
  });
};

const handleVerifySignature = (btnId) => {
  $(btnId).on('click', async function (e) {
    const file = $('#plainText2').prop('files')[0];
    if (!file) {
      return alert('Vui lòng chọn file!');
    }
    const firstPublicNum = $('#firstPublicNum2').val();
    const secondPublicNum = $('#secondPublicNum2').val();
    if (!firstPublicNum || !secondPublicNum) {
      return alert('Vui lòng nhập khoá công khai!');
    }
    const signature = $('#signature2').val();
    if (!signature) {
      return alert('Vui lòng nhập chữ ký!');
    }

    try {
      const hashText = await fileToSha256Hex(file);
      $('#hashText2').val(hashText);
      const decryptedText = decrypt(signature, firstPublicNum, secondPublicNum);

      let message;
      if (hashText === decryptedText) {
        message = 'File chưa chỉnh sửa!';
      } else {
        message = 'File, chữ ký hoặc khoá đã chỉnh sửa!';
      }

      $('#result').val(message);
    } catch (e) {
      alert(e.message);
    }
  });
};

const handleUploadSignature = (btnId) => {
  $(btnId).on('click', async function (e) {
    const fileInput = $("<input type='file'>");
    fileInput.attr('accept', '.txt');

    fileInput.on('change', function (event) {
      const file = event.target.files[0];
      const reader = new FileReader();

      reader.onload = function (e) {
        const contents = e.target.result;
        $('#signature2').val(contents);
      };

      reader.onerror = function (e) {
        console.error('Error reading file: ', e);
      };

      reader.readAsText(file);
    });

    fileInput.click();
  });
};

const handleToggleEye = (btnId) => {
  $(btnId).on('click', function () {
    $(this).toggleClass('fa-eye fa-eye-slash');
    const tabNum = btnId.at(-1);
    switch (tabNum) {
      case '1':
        $('#firstSecretNum1').prop('type', $(this).hasClass('fa-eye') ? 'password' : 'text');
        $('#secondSecretNum1').prop('type', $(this).hasClass('fa-eye') ? 'password' : 'text');
        break;
      case '2':
        $('#firstSecretNum2').prop('type', $(this).hasClass('fa-eye') ? 'password' : 'text');
        $('#secondSecretNum2').prop('type', $(this).hasClass('fa-eye') ? 'password' : 'text');
        break;
    }
  });
};

$(document).ready(function () {
  handleRandomPrimeNums('#randomPrimeNumsBtn');
  handleGenerateKeys('#generateKeysBtn');
  handleClear('#clearBtn1');
  handleClear('#clearBtn2');
  handleClear('#clearBtn3');
  handleCreateSignature('#createSignatureBtn');
  handleSaveSignature('#saveSignatureBtn');
  handleMoveData('#moveDataBtn1');
  handleMoveData('#moveDataBtn2');
  handleVerifySignature('#verifySignatureBtn');
  handleUploadSignature('#uploadSignatureBtn');
  handleToggleEye('#toggleEyeBtn1');
  handleToggleEye('#toggleEyeBtn2');
});
