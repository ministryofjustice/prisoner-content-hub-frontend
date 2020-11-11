const encryption = require('../encryption')('C6jvLBjmtt9OnzeP5C3dQH7DewI6GK1h');

describe('Encryption', () => {
  it('should encrypt and decrypt data', () => {
    const data = 'foo';

    const encrypted = encryption.encrypt(data);
    const decrypted = encryption.decrypt(encrypted);

    expect(decrypted).toBe(data);
  });

  it('should use an initialization vector to strengthen encryption', () => {
    const data = 'somethingSuperSecret';

    const firstEncryption = encryption.encrypt(data);
    const secondEncryption = encryption.encrypt(data);

    expect(firstEncryption.split(':').length).toBe(
      2,
      'It should store the IV against the encrypted data',
    );

    expect(firstEncryption).not.toBe(secondEncryption);
  });
});
