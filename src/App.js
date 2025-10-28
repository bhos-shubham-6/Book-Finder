import React, { useState } from "react";

function App() {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchBooks = async () => {
    if (!query.trim()) {
      setError("Please enter a book title to search.");
      return;
    }

    setLoading(true);
    setError("");
    setBooks([]);

    try {
      const response = await fetch(
        `https://openlibrary.org/search.json?title=${query}`
      );
      const data = await response.json();

      if (data.docs.length === 0) {
        setError("No results found.");
      } else {
        setBooks(data.docs.slice(0, 20));
      }
    } catch {
      setError("Something went wrong while fetching data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold mb-6 text-blue-700">📚 Book Finder</h1>

      <div className="w-full max-w-md flex mb-6">
        <input
          type="text"
          placeholder="Search for a book..."
          className="flex-grow p-3 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && fetchBooks()}
        />
        <button
          onClick={fetchBooks}
          className="bg-blue-600 text-white px-5 py-3 rounded-r-lg hover:bg-blue-700"
        >
          Search
        </button>
      </div>

      {loading && <p className="text-gray-500">Loading books...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 mt-6 w-full max-w-5xl">
        {books.map((book, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow hover:shadow-lg transition p-4 flex flex-col items-center text-center"
          >
            <img
              src={
                book.cover_i
                  ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
                  : "https://via.placeholder.com/150x220?text=No+Cover"
              }
              alt={book.title}
              className="w-32 h-48 object-cover rounded-md mb-3"
            />
            <h2 className="font-semibold text-lg">{book.title}</h2>
            <p className="text-sm text-gray-600">
              {book.author_name ? book.author_name.join(", ") : "Unknown Author"}
            </p>
            <a
              href={`https://openlibrary.org${book.key}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 text-blue-600 hover:underline"
            >
              View Details
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
