import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";

const Bookshelves = () => {
  const { userId } = useParams();
  const [bookshelves, setBookshelves] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookshelves = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/users/${userId}/bookshelves`
        );
        setBookshelves(response.data);
      } catch (error) {
        console.error("Error fetching bookshelves", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookshelves();
  }, [userId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Bookshelves</h1>
      {bookshelves.map((shelf) => (
        <div key={shelf.id}>
          <h2>{shelf.name}</h2>
          <ul>
            {shelf.books.map((bookId) => (
              <li key={bookId}>
                <Link to={`/books/${bookId}`}>Book {bookId}</Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default Bookshelves;
