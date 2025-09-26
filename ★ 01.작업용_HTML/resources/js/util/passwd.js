/**
 * PBKDF2 방식의 AES128 암호화
 */
var woEncrypt = function (plainText) {
    var PASS_SALT = "4b796f4c696d536f66745f6d657469735f6c6d73";
    var PASS_IV = "4c6162535f4d657469735f4672616d65";
    var PASS_PHRASE = "v1.0";
    var PASS_ITERATION = 1000;
    var PASS_KEY_SIZE = 128;

    // PBKDF2 키 생성
    var key128Bits100Iterations = CryptoJS.PBKDF2(PASS_PHRASE, CryptoJS.enc.Hex.parse(PASS_SALT), {keySize: parseInt(PASS_KEY_SIZE)/32, iterations: parseInt(PASS_ITERATION)});
    var encrypted = CryptoJS.AES.encrypt(plainText, key128Bits100Iterations, {iv: CryptoJS.enc.Hex.parse(PASS_IV)});

    return encrypted.toString();
};