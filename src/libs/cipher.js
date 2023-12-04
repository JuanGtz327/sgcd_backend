import crypto from 'crypto';

const ALGORITHM = 'aes-256-cbc';
const SECRET_KEY = process.env.JWT_SECRET;

// Función para encriptar datos
export function encrypt(text) {
  const key = crypto.scryptSync(SECRET_KEY, 'salt', 32); // Genera una clave derivada de la contraseña (32 bytes para AES-256)
  const iv = crypto.randomBytes(16); // Vector de inicialización para crear un cifrado seguro

  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted; // Devuelve el IV y el texto cifrado concatenados
}

export function decrypt(encryptedText) {
  const key = crypto.scryptSync(SECRET_KEY, 'salt', 32);
  const encryptedArray = encryptedText.split(':'); // Separa el IV del texto cifrado
  const iv = Buffer.from(encryptedArray[0], 'hex');
  const textToDecrypt = encryptedArray[1];

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  let decrypted = decipher.update(textToDecrypt, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

/*
let text = 'Hola mundo';
let encryptedText = encrypt(text);

console.log('Texto original: ' + text);
console.log('Texto cifrado: ' + encryptedText);
let decryptedText = decrypt('774c7e00d994b69db8684d08a47c0b02:1ad2115b9a40f17c6d31eeca22f6d20d');
console.log('Texto descifrado: ' + decryptedText);
*/
