**0/ Check if a number is odd** 
 `X & 1 == 1` 
 - The least significant bit determines if a number is odd. This works because odd numbers always have their last bit as 1, while even numbers have it as 0. 
 - Example: For `X = 5` (`101` in binary), `5 & 1 = 1`, so it’s odd.

**1/ Set the kth bit**
 `X = X | (1 << k)` 
 - Use OR to ensure the kth bit is set to 1 without changing any other bits. 
 - Example: For `X = 5` (`101`) and `k = 1`, `(1 << 1)` creates `10` in binary. OR-ing `101 | 10` gives `111` (`7` in decimal). 

**2/ Flip the kth bit**
 `X = X ^ (1 << k)` 
 - XOR toggles the kth bit. If it’s 1, it becomes 0; if it’s 0, it becomes 1. 
 - Example: For `X = 5` (`101`) and `k = 1`, `(1 << 1)` creates `10`. XOR-ing `101 ^ 10` gives `111` (`7` in decimal). 

**3/ Count the number of set bits** 
 Use `__builtin_popcount(X)` (C++) or `bin(X).count('1')` (Python). 
 - Efficiently count 1s in the binary representation of a number. 
 - Example: For `X = 13` (`1101`), the result is 3, as there are three 1s. 

**4/ Check if the kth bit is set** 
 `(X >> k) & 1 == 1` 
 - Shift the binary representation of `X` to the right by `k` places. Use AND to check if the last bit is 1. 
 - Example: For `X = 13` (`1101`) and `k = 2`, shifting gives `11` (`3` in decimal), and `3 & 1 = 1`, so the 2nd bit is set. 

**5/ Check if a number is a power of 2** 
 `X & (X - 1) == 0` 
 - Numbers that are powers of 2 have exactly one bit set. Subtracting 1 flips all bits after the set bit, making the AND operation zero. 
 - Example: For `X = 8` (`1000`), `X - 1 = 7` (`0111`), and `8 & 7 = 0`. 

**6/ Extract the lowest set bit** 
 `X & -X` 
 - Isolates the least significant bit that’s set to 1. 
 - Example: For `X = 10` (`1010`), `X & -X = 2` (`0010`), as the lowest set bit is in the 2nd position. 

**7/ Swap two numbers without a temporary variable** 
 
 A = A ^ B 
 B = A ^ B 
 A = A ^ B 
 
 - XOR reverses itself, effectively swapping values. 
 - Example: Let `A = 3` and `B = 5`. After performing these steps, `A = 5` and `B = 3`. 

**8 / Super handy addition trick** 
 `A + B = (A | B) + (A & B)` 
 - OR counts each bit once, and AND adds overlapping bits twice. 
 - Example: For `A = 6` (`110`) and `B = 3` (`011`), `A | B = 7` and `A & B = 2`, so `A + B = 9`. 

**9/ Unset the kth bit** 
 `X = X & ~(1 << k)` 
 - Combine AND with the negation of a left shift to clear the kth bit. 
 - Example: For `X = 13` (`1101`) and `k = 2`, `(1 << 2)` gives `100`. Negating it gives `011`. AND-ing `1101 & 011` gives `9` (`1001`).
