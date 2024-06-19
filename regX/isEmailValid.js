const isEmailValid = address => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address);

isEmailValid('abcd@site.com'); // true
isEmailValid('ab_c@site.com'); // true
isEmailValid('ab.c@site.com'); // true
isEmailValid('a@my.site.com'); // true
isEmailValid('ab c@site.com'); // false
isEmailValid('ab@c@site.com'); // false
isEmailValid('abcde@sitecom'); // false
isEmailValid('abcdesite.com'); // false