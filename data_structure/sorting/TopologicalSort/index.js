// Implement a function that performs a topological sort on a directed graph (in
// adjacency list format), where the keys represent nodes and values are an
// array of nodes that have an outgoing edge to the current node.

// Examples

const graph1 = {
  A: ["B", "C"],
  B: ["C", "D", "E"],
  C: ["F"],
  D: [],
  E: ["F"],
  F: [],
};
topologicalSort(graph1); // ['A', 'B', 'C', 'D', 'E', 'F']

const graph2 = {
  A: ["B", "C"],
  B: ["C", "D"],
  C: ["D"],
  D: ["E"],
  E: ["F"],
  F: [],
};
topologicalSort(graph2); // ['A', 'B', 'C', 'D', 'E', 'F']

const graph3 = {
  A: [],
  B: ["A"],
  C: ["B"],
  D: ["C"],
  E: ["D"],
  F: ["E"],
};
topologicalSort(graph3); // ['F', 'E', 'D', 'C', 'B', 'A']

// Note that there can be multiple valid topological orderings for a directed
// graph, but for our test cases there is only one valid solution.

// A Queue data structure is also provided for you at the bottom of the skeleton
// code.

// Topological sort is an algorithm which is used to sort the elements of a
// directed acyclic graph (DAG) in a linear order such that the order respects
// the order defined by edges within the graph.

// The easy way to understand this is to think of the nodes of a graph as tasks,
// and an edge from node A to node B represents that node B has a dependency on
// node A. What a topological sort does is to produce an array of nodes out of
// the graph such that the order of nodes in the array respects all the
// dependencies defined in the graph.

// Why is it that a topological sort only works on DAGs and not any graph? This
// is because the graph has to have directed edges in order to represent
// dependencies, and acyclic (no cycles) because any cycles would represent an
// unresolvable dependency between nodes.

// Topological sorting is often used in scheduling problems, such as scheduling
// tasks with dependencies, or in compilation, where the order of compilation is
// determined by the dependencies between modules.

// There are many ways to implement topological sort, but one simple and
// intuitive way is using the Kahn's algorithm, which works as follows:

// Initialize a queue and a list to store the sorted nodes. For each node in the
// graph, if it has no incoming edges, add it to the queue. While the queue is
// not empty: Dequeue a node from the front of the queue. Add this node to the
// list of sorted nodes. For each child of this node, decrease its in-degree
// (the number of incoming edges) by 1. If a child's in-degree becomes 0, add it
// to the queue. If the length of the sorted list is less than the number of
// nodes in the graph, this means that there is a cycle in the graph, and no
// topological ordering is possible.
