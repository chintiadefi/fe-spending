import cookie from 'react-cookies';

const maxAgeDay = 7;
const mandatory = () => {
  throw new Error('Storage Missing parameter!');
};

export default class Storage {
  constructor(name = mandatory(), value = null, options = {}) {
    this.name = name;
    this.options = options;

    if (!this.value) {
      this.value = value;
    }
  }

  set value(value) {
    if (value) {
      cookie.save(this.name, value, {
        path: '/',
        maxAge: maxAgeDay * 24 * 60 * 60,
        ...this.options,
      });
    }
  }

  get value() {
    return cookie.load(this.name);
  }

  get allCookies() {
    return cookie.loadAll();
  }

  destroy = (next = (...f) => f) => {
    cookie.remove(this.name, {
      path: '/',
      maxAge: maxAgeDay * 24 * 60 * 60,
      ...this.options,
    });
    next();
  };
}
