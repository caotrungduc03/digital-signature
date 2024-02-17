$('#createSignatureBtn').on('click', async function (e) {
  const file = $('#plainText1').prop('files')[0];
  const hash = await fileToSha256Hex(file);

  $('#hashText1').val(hash);
});

$('#verifySignatureBtn').on('click', async function (e) {
  const file = $('#plainText2').prop('files')[0];
  const hash = await fileToSha256Hex(file);

  $('#hashText2').val(hash);
});
