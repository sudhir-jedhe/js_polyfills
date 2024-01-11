// Given a linked list of coordinates where adjacent points either form a vertical line or a horizontal line. Delete points from the linked list which are in the middle of a horizontal or vertical line.

// Examples:

// Input:  (0,10)->(1,10)->(5,10)->(7,10)
//                                   |
//                                 (7,5)->(20,5)->(40,5)
// Output: Linked List should be changed to following
//         (0,10)->(7,10)
//                   |
//                 (7,5)->(40,5)
// The given linked list represents a horizontal line from (0,10)
// to (7, 10) followed by a vertical line from (7, 10) to (7, 5),
// followed by a horizontal line from (7, 5) to (40, 5).

// Input:     (2,3)->(4,3)->(6,3)->(10,3)->(12,3)
// Output: Linked List should be changed to following
//     (2,3)->(12,3)
// There is only one vertical line, so all middle points are removed.

// Javascript program to remove middle
// points in a linked list of
// line segments,
var head; // head of list

/* Linked list Node */
class Node {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.next = null;
  }
}

// This function deletes middle
// nodes in a sequence of
// horizontal and vertical line
// segments represented
// by linked list.
function deleteMiddle() {
  // If only one node or no
  // node...Return back
  if (head == null || head.next == null || head.next.next == null) return head;

  var Next = head.next;
  var NextNext = Next.next;

  // check if this is vertical or
  // horizontal line
  if (head.x == Next.x) {
    // Find middle nodes with same
    // value as x and
    // delete them.
    while (NextNext != null && Next.x == NextNext.x) {
      head.next = Next.next;
      Next.next = null;

      // Update NextNext for the next iteration
      Next = NextNext;
      NextNext = NextNext.next;
    }
  }

  // if horizontal
  else if (head.y == Next.y) {
    // find middle nodes with same value as y and
    // delete them
    while (NextNext != null && Next.y == NextNext.y) {
      head.next = Next.next;
      Next.next = null;

      // Update NextNext for the next iteration
      Next = NextNext;
      NextNext = NextNext.next;
    }
  }

  // Adjacent points should have same x or same y
  else {
    document.write("Given list is not valid");
    return null;
  }

  // recur for other segment

  // temporarily store the head and move head forward.
  var temp = head;
  head = head.next;

  // call deleteMiddle() for next segment
  this.deleteMiddle();

  // restore head
  head = temp;

  // return the head
  return head;
}

/*
	Given a reference (pointer to pointer) to 
	the head of a list and an int, push
	a new node on the front of the list.
	*/
function push(x, y) {
  /*
		1 & 2: Allocate the Node & Put in the data
		*/
  var new_node = new Node(x, y);

  /* 3. Make next of new Node as head */
  new_node.next = head;

  /* 4. Move the head to point to new Node */
  head = new_node;
}

function printList() {
  var temp = head;
  while (temp != null) {
    document.write("(" + temp.x + "," + temp.y + ")->");
    temp = temp.next;
  }
  document.write("<br/>");
}

/* Driver program to test above functions */

push(40, 5);
push(20, 5);
push(10, 5);
push(10, 8);
push(10, 10);
push(3, 10);
push(1, 10);
push(0, 10);

document.write("Given list<br/>");
printList();

if (deleteMiddle() != null) {
  document.write("Modified Linked List is<br/>");
  printList();
}

// This code contributed by gauravrajput1

// Given Linked List:
// (0,10)-> (1,10)-> (3,10)-> (10,10)-> (10,8)-> (10,5)-> (20,5)-> (40,5)->
// Modified Linked List:
// (0,10)-> (10,10)-> (10,5)-> (40,5)->
