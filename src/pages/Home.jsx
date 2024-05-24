import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../styles/Home.css"; // Import the CSS file

const Home = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get("http://localhost:5000/books");
        setBooks(response.data);
      } catch (error) {
        console.error("Error fetching books", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:5000/books?q=${query}`
      );
      setBooks(response.data);
    } catch (error) {
      console.error("Error searching books", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredBooks = books.filter((book) =>
    ["title", "author", "genre"].some((field) =>
      book[field].toLowerCase().includes(query.toLowerCase())
    )
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="home-container">
      <h1>Featured Books</h1>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search books..."
        />
        <button type="submit">Search</button>
      </form>
      <div className="books-grid">
        {filteredBooks.map((book) => (
          <div className="book-item" key={book.id}>
            <Link to={`/books/${book.id}`}>
              <img src={book.coverImage} alt={book.title} />
              <h2>{book.title}</h2>
              <p>{book.author}</p>
              <p>{book.genre}</p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
