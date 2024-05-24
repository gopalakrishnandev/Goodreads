import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import StarRatings from "react-star-ratings";

const BookDetails = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newReview, setNewReview] = useState({ rating: 0, review: "" });
  const [error, setError] = useState(null);
  const [relatedBooks, setRelatedBooks] = useState([]);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/books/${id}`);
        setBook(response.data);
        fetchRelatedBooks(response.data.genre);
      } catch (error) {
        console.error("Error fetching book", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchRelatedBooks = async (genre) => {
      try {
        const response = await axios.get("http://localhost:5000/books");
        const related = response.data.filter(
          (b) => b.genre === genre && b.id !== parseInt(id)
        );
        setRelatedBooks(related);
      } catch (error) {
        console.error("Error fetching related books", error);
      }
    };

    fetchBook();
  }, [id]);

  const handleRatingChange = (newRating) => {
    setNewReview((prevReview) => ({
      ...prevReview,
      rating: newRating,
    }));
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewReview((prevReview) => ({
      ...prevReview,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    try {
      const bookResponse = await axios.get(`http://localhost:5000/books/${id}`);
      const updatedReviews = [...bookResponse.data.reviews, newReview];

      await axios.put(`http://localhost:5000/books/${id}`, {
        ...bookResponse.data,
        reviews: updatedReviews,
      });

      setBook((prevBook) => ({
        ...prevBook,
        reviews: updatedReviews,
      }));
      setNewReview({ rating: 0, review: "" });
    } catch (error) {
      setError("Error submitting review");
      console.error("Error submitting review", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!book) {
    return <div>Book not found</div>;
  }

  return (
    <div>
      <h1>{book.title}</h1>
      <p>{book.author}</p>
      <img src={book.coverImage} alt={book.title} />
      <p>{book.description}</p>
      <p>{book.genre}</p>

      <div>
        <h2>Reviews</h2>
        {book.reviews.map((review, index) => (
          <div key={index}>
            <StarRatings
              rating={review.rating}
              starRatedColor="gold"
              numberOfStars={5}
              starDimension="20px"
              starSpacing="2px"
              name={`rating-${index}`}
            />
            <p>{review.review}</p>
          </div>
        ))}
      </div>

      <div>
        <h2>Add a Review</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <StarRatings
              rating={newReview.rating}
              starRatedColor="gold"
              changeRating={handleRatingChange}
              numberOfStars={5}
              starDimension="20px"
              starSpacing="2px"
              name="rating"
            />
          </div>
          <div>
            <textarea
              name="review"
              value={newReview.review}
              onChange={handleInputChange}
              placeholder="Write your review here"
              required
            />
          </div>

          <button type="submit">Submit Review</button>
        </form>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>

      <div>
        <h2>Related Books</h2>
        {relatedBooks.map((relatedBook) => (
          <div key={relatedBook.id}>
            <Link to={`/books/${relatedBook.id}`}>
              <h3>{relatedBook.title}</h3>
              <p>{relatedBook.author}</p>
              <img src={relatedBook.coverImage} alt={relatedBook.title} />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookDetails;
