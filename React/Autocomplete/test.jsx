const author = {
  firstName: "Joanne",
  lastName: "Rowling",
  description: "British author and philanthropist",
  books: [
    "Harry Potter and the Philosopher's Stone",
    "Harry Potter and the Chamber of Secrets",
    "Harry Potter and the Prisoner of Azkaban",
  ],
};

// Don't change the Component name "App"
function App() {
  return (
    <div>
      // TODO: Display information about author using JavaScript variables and
      JSX syntax
      <h2>
        {author.firstName} {author.lastName}
      </h2>
      <p>{author.description}</p>
      <ul>
        {author.books.map((book, i) => {
          return <li key={i}>{books} </li>;
        })}
      </ul>
      <button> Buy {author.firstName}'s books </button>
    </div>
  );
}

export default App;
