// RegExp: Which split the IP address on. (dot) and check for each element whether they are valid or not(0-255).

var addr = "172.169.43.1";

/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(
  addr
);

//RegExp: Split the IP address on :(colon) and check for each element whether they are valid or not(0000-ffff).
var addr = "2001:0db8:0000:0000:0000:ff00:0042:8329";
/^[a-fA-F0-9]{1, 4}\:[a-fA-F0-9]{1, 4}\:[a-fA-F0-9]{1, 4}\:[a-fA-F0-9]{1, 4}\:[a-fA-F0-9]{1, 4}\:[a-fA-F0-9]{1, 4}\:[a-fA-F0-9]{1, 4}\:[a-fA-F0-9]{1, 4}$/.test(
  addr
);
