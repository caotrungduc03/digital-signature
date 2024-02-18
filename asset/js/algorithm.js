const generateRSAKeyPair = (p, q) => {
  const n = p * q;
  const phi = (p - 1) * (q - 1);
  let e = getRandomCoPrime(phi);
  const d = mul_inv(e, phi);
  const publicKey = { n, e };
  const privateKey = { n, d };

  return { publicKey, privateKey };
};

const getRandomPrime = (max = 100) => {
  let prime = getRandomNumber(1, max);
  while (!isPrime(prime)) {
    prime = getRandomNumber(1, max);
  }
  return prime;
};

const getRandomNumber = (min = 1, max = 100) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const isPrime = (x) => {
  if (x <= 2) {
    return x === 2;
  }

  if (x % 2 === 0) {
    return false;
  }

  for (let i = 3; i * i <= x; i += 2) {
    if (x % i === 0) {
      return false;
    }
  }

  return true;
};

const getRandomCoPrime = (phi) => {
  let coPrime = getRandomNumber(1, phi);
  while (!isPrime(coPrime) || gcd(coPrime, phi) !== 1) {
    coPrime = getRandomNumber(1, phi);
  }
  return coPrime;
};

const gcd = (a, b) => {
  while (b !== 0) {
    const temp = b;
    b = a % b;
    a = temp;
  }
  return a;
};

const mul_inv = (a, n) => {
  if (a < 0) a += n;
  const n0 = n;
  let x0 = 0,
    x1 = 1;
  while (a > 1) {
    const q = Math.floor(a / n);
    const tmp = a % n;
    a = n;
    n = tmp;
    const newX0 = x1 - q * x0;
    x1 = x0;
    x0 = newX0;
  }
  return x1 < 0 ? x1 + n0 : x1;
};

const encrypt = (plainText, d, n) => {
  let cipherText = '';
  for (let char of plainText) {
    let tmp = powMod(char.charCodeAt(0), d, n);
    cipherText += tmp + '-';
  }
  return cipherText.slice(0, -1);
};

const powMod = (a, b, n) => {
  if (b === 0) return 1;
  const temp = powMod(a, b >> 1, n);
  return (b & 1) === 0 ? (temp * temp) % n : (((temp * temp) % n) * a) % n;
};

const decrypt = (cipherText, e, n) => {
  const numbers = cipherText.split('-').map(Number);
  let plainText = '';
  for (let number of numbers) {
    let tmp = powMod(number, e, n);
    plainText += String.fromCharCode(tmp);
  }
  return plainText;
};
