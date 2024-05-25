import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Home.css";

const Home = () => {
  const navigate = useNavigate();

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [user, setUser] = useState(null);
  const [showOptionsIndex, setShowOptionsIndex] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);

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

    const loggedInUser = JSON.parse(localStorage.getItem("user"));
    setUser(loggedInUser);
  }, []);

  const filteredBooks = books.filter((book) =>
    ["title", "author", "genre"].some((field) =>
      book[field].toLowerCase().includes(query.toLowerCase())
    )
  );

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

  const addToBookshelf = async (bookId, shelf) => {
    if (!user) {
      alert("You need to log in to add books to your bookshelf.");
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:5000/users/${user.id}`
      );
      const userData = response.data;
      const bookshelves = userData.bookshelves || {
        read: [],
        currentlyReading: [],
        toRead: [],
      };

      const updatedBookshelf = {
        ...bookshelves,
        [shelf]: [...bookshelves[shelf], bookId],
      };

      await axios.put(`http://localhost:5000/users/${user.id}`, {
        ...userData,
        bookshelves: updatedBookshelf,
      });

      alert(`Book added to your ${shelf} shelf.`);
      navigate(`/bookshelves/${user.id}`);
    } catch (error) {
      console.error("Error adding book to bookshelf", error);
    }
  };

  const toggleOptions = (index) => {
    setShowOptionsIndex(index === showOptionsIndex ? null : index);
  };

  const handleBookClick = (book) => {
    setSelectedBook(book);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="home-container">
      <div className="d-flex justify-content-between">
        <h1>Featured Books</h1>
        <form onSubmit={handleSearch} className="mt-3">
          <input
            type="text"
            className="form-control-sm"
            placeholder="Search books"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </form>
      </div>

      <div className="books-grid">
        {filteredBooks.map((book, index) => (
          <div
            className="book-item"
            key={book.id}
            onClick={() => handleBookClick(book)}
          >
            <div className="card">
              <Link to={`/books/${book.id}`}>
                <img
                  src={book.coverImage}
                  alt={book.title}
                  className="card-img-top"
                  style={{ width: "100%", height: "200px" }}
                />
              </Link>
            </div>

            <div className="triple-dot" onClick={() => toggleOptions(index)}>
              <span>&#8286;</span>
            </div>
            {showOptionsIndex === index &&
              selectedBook &&
              selectedBook.id === book.id && (
                <div className="options-container">
                  <button onClick={() => addToBookshelf(book.id, "read")}>
                    Read
                  </button>
                  <button
                    onClick={() => addToBookshelf(book.id, "currentlyReading")}
                  >
                    Currently Reading
                  </button>
                  <button onClick={() => addToBookshelf(book.id, "toRead")}>
                    Want to Read
                  </button>
                </div>
              )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
