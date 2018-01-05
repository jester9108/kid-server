// app/auth/auth.message.js

'use strict';

const dupeKey = key => `An account with this ${key} already exists.`;

exports.DUPLICATE_KEY = dupeKey;
