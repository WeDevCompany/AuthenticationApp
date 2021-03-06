import { Email } from '../../../OAuth/Domain/Email';

const VALID_EMAILS = ['evrtrabajo@pep.com', 'evrtrabajo@pep.com', 'e@pep.com'];
const INVALID_EMAILS = ['evrtrabajopep.com', 'e @pep', 'evrtrabajo@pep.', 'evr.trabajo@gmail'];
const EMPTY_EMAIL = '';

describe('It should validate the email attribute', () => {
  it('should create a valid email', () => {
    VALID_EMAILS.forEach(mail => {
      expect(new Email(mail).value).toBe(mail);
    });
  });
  it('should fail on creating an email with an empty string', () => {
    expect(() => new Email(EMPTY_EMAIL)).toThrowError(/^EmptyAtributeError.*/);
  });

  it('should fail on creating an email with an invalid email', () => {
    INVALID_EMAILS.forEach(mail => {
      expect(() => new Email(mail)).toThrowError(/^InvalidEmailError.*/);
    });
  });
});
