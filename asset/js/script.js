$('#randomPrimeNumsBtn').on('click', function (e) {
  let p = getRandomPrime(10000);
  let q = getRandomPrime(10000);
  while (p === q) {
    q = getRandomPrime(10000);
  }
  $('#firstPrimeNum').val(p);
  $('#secondPrimeNum').val(q);
});

$('#generateKeysBtn').on('click', function (e) {
  const p = parseInt($('#firstPrimeNum').val());
  const q = parseInt($('#secondPrimeNum').val());
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

$('#clearBtn').on('click', function () {
  $('#firstPrimeNum').val('');
  $('#secondPrimeNum').val('');
  $('#firstPublicNum1').val('');
  $('#secondPublicNum1').val('');
  $('#firstSecretNum1').val('');
  $('#secondSecretNum1').val('');
});

$('#createSignatureBtn').on('click', async function (e) {
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
    alert('Lỗi xảy ra trong quá trình xác minh. Vui lòng kiểm tra lại dữ liệu!');
  }
});

$('#saveSignatureBtn').on('click', async function (e) {
  const link = document.createElement('a');
  const content = $('#signature1').val();
  const file = new Blob([content], { type: 'text/plain' });
  link.href = URL.createObjectURL(file);
  link.download = 'signature.txt';
  link.click();
  URL.revokeObjectURL(link.href);
});

$('#moveDataBtn').on('click', function (e) {
  const signature = $('#signature1').val();
  $('#signature2').val(signature);
});

$('#verifySignatureBtn').on('click', async function (e) {
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
    alert('Lỗi xảy ra trong quá trình xác minh. Vui lòng kiểm tra lại dữ liệu!');
  }
});

$('#uploadSignatureBtn').on('click', async function (e) {
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
