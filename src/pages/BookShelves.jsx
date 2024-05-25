import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/BookShelves.css";

const Bookshelves = () => {
  const { id } = useParams(); // Get the user ID from the route params
  const [user, setUser] = useState(null);
  const [selectedShelf, setSelectedShelf] = useState("read");
  const [books, setBooks] = useState({
    read: [],
    currentlyReading: [],
    toRead: [],
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/users/${id}`);
        setUser(response.data);

        await Promise.all([
          fetchBooks(response.data.bookshelves.read, "read"),
          fetchBooks(
            response.data.bookshelves.currentlyReading,
            "currentlyReading"
          ),
          fetchBooks(response.data.bookshelves.toRead, "toRead"),
        ]);
      } catch (error) {
        console.error("Error fetching user data", error);
      }
    };

    fetchUser();
  }, [id]);

  const fetchBooks = async (bookIds, shelf) => {
    try {
      const bookDetails = await Promise.all(
        bookIds.map((bookId) =>
          axios.get(`http://localhost:5000/books/${bookId}`)
        )
      );
      setBooks((prevBooks) => ({
        ...prevBooks,
        [shelf]: bookDetails.map((response) => response.data),
      }));
    } catch (error) {
      console.error(`Error fetching books for shelf ${shelf}`, error);
    }
  };

  const handleRemoveFromBookshelf = async (bookId, shelf) => {
    if (!user) {
      alert("You need to log in to remove books from your bookshelf.");
      return;
    }

    try {
      const updatedBookshelf = {
        ...user.bookshelves,
        [shelf]: user.bookshelves[shelf].filter((id) => id !== bookId),
      };

      await axios.put(`http://localhost:5000/users/${user.id}`, {
        ...user,
        bookshelves: updatedBookshelf,
      });

      // Update state immediately to reflect changes in the UI
      setBooks((prevBooks) => ({
        ...prevBooks,
        [shelf]: prevBooks[shelf].filter((book) => book.id !== bookId),
      }));

      alert(`Book removed from your ${shelf} shelf.`);
    } catch (error) {
      console.error(`Error removing book from ${shelf} shelf`, error);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  const renderBooksTable = (books, shelf) => {
    if (books.length === 0) {
      return <div>No books found</div>;
    }
    return (
      <table className="table">
        <thead>
          <tr>
            <th>Cover</th>
            <th>Title</th>
            <th>Author</th>
            <th>Genre</th>
            <th>Avg rating</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book.id}>
              <td>
                <img src={book.coverImage} alt={book.title} width="50" />
              </td>
              <td>
                <Link to={`/books/${book.id}`}>{book.title}</Link>
              </td>
              <td>{book.author}</td>
              <td>{book.genre}</td>
              <td>{book.averageRating}</td>
              <td>
                <button
                  onClick={() => handleRemoveFromBookshelf(book.id, shelf)}
                  className="btn btn-danger btn-sm"
                >
                  <i className="fas fa-trash"></i> Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div>
      <h1>Bookshelves</h1>
      <div className="bookshelf-tabs">
        <button
          onClick={() => setSelectedShelf("read")}
          className={selectedShelf === "read" ? "active" : ""}
        >
          Read
        </button>
        <button
          onClick={() => setSelectedShelf("currentlyReading")}
          className={selectedShelf === "currentlyReading" ? "active" : ""}
        >
          Currently Reading
        </button>
        <button
          onClick={() => setSelectedShelf("toRead")}
          className={selectedShelf === "toRead" ? "active" : ""}
        >
          To Read
        </button>
      </div>
      <div className="bookshelf-content">
        {selectedShelf === "read" && renderBooksTable(books.read, "read")}
        {selectedShelf === "currentlyReading" &&
          renderBooksTable(books.currentlyReading, "currentlyReading")}
        {selectedShelf === "toRead" && renderBooksTable(books.toRead, "toRead")}
      </div>
    </div>
  );
};

export default Bookshelves;
